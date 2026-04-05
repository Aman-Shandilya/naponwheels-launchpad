import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  User, Bus, MapPin, Sparkles, ShieldCheck, IndianRupee, Clock, CheckCircle2,
  ArrowLeft, ArrowRight, Loader2, Upload, X, Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const STEPS = [
  { label: 'Owner', icon: User },
  { label: 'Bus', icon: Bus },
  { label: 'Location', icon: MapPin },
  { label: 'Amenities', icon: Sparkles },
  { label: 'Safety', icon: ShieldCheck },
  { label: 'Pricing', icon: IndianRupee },
  { label: 'Availability', icon: Clock },
  { label: 'Review', icon: CheckCircle2 },
];

const BUS_TYPES = [
  { value: 'ac_sleeper', label: 'AC Sleeper' },
  { value: 'non_ac', label: 'Non-AC Sleeper' },
  { value: 'luxury', label: 'Luxury Sleeper' },
];

const AMENITIES_LIST = [
  'AC', 'Charging Points', 'Blankets', 'Curtains', 'CCTV', 'Security Guard', 'Washroom', 'WiFi', 'Reading Light',
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface FormData {
  // Owner
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  businessType: 'individual' | 'company';
  // Bus
  busName: string;
  operatorName: string;
  busType: string;
  totalBerths: number;
  registrationNumber: string;
  // Location
  address: string;
  city: string;
  landmark: string;
  parkingLocation: string;
  // Amenities
  amenities: string[];
  // Safety
  secureParkingConfirmed: boolean;
  // Pricing
  pricePerHour: number;
  nightPackagePrice: number;
  weekendPrice: number;
  discountEnabled: boolean;
  // Availability
  availableDays: string[];
  timeSlotStart: string;
  timeSlotEnd: string;
  recurringAvailability: boolean;
}

const defaultForm: FormData = {
  ownerName: '', ownerPhone: '', ownerEmail: '', businessType: 'individual',
  busName: '', operatorName: '', busType: 'ac_sleeper', totalBerths: 12, registrationNumber: '',
  address: '', city: '', landmark: '', parkingLocation: '',
  amenities: [],
  secureParkingConfirmed: false,
  pricePerHour: 0, nightPackagePrice: 0, weekendPrice: 0, discountEnabled: false,
  availableDays: [], timeSlotStart: '20:00', timeSlotEnd: '08:00', recurringAvailability: true,
};

const RegisterBus = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    rc: null, owner_id: null, photo_interior: null, photo_exterior: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const updateForm = (updates: Partial<FormData>) => setForm(prev => ({ ...prev, ...updates }));

  const validateStep = (): string[] => {
    const errs: string[] = [];
    switch (step) {
      case 0:
        if (!form.ownerName.trim()) errs.push('Owner name is required');
        if (!form.ownerPhone.trim()) errs.push('Phone number is required');
        if (!form.ownerEmail.trim()) errs.push('Email is required');
        break;
      case 1:
        if (!form.busName.trim()) errs.push('Bus name is required');
        if (!form.registrationNumber.trim()) errs.push('Registration number is required');
        if (form.totalBerths < 1) errs.push('At least 1 berth required');
        break;
      case 2:
        if (!form.address.trim()) errs.push('Address is required');
        if (!form.city.trim()) errs.push('City is required');
        break;
      case 5:
        if (form.pricePerHour <= 0) errs.push('Price per hour must be greater than 0');
        break;
      case 6:
        if (form.availableDays.length === 0) errs.push('Select at least one day');
        break;
    }
    return errs;
  };

  const nextStep = () => {
    const errs = validateStep();
    if (errs.length) { setErrors(errs); return; }
    setErrors([]);
    setStep(s => Math.min(s + 1, 7));
  };

  const prevStep = () => { setErrors([]); setStep(s => Math.max(s - 1, 0)); };

  const handleFileChange = (key: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [key]: file }));
  };

  const uploadFile = async (busId: string, key: string, file: File) => {
    const ext = file.name.split('.').pop();
    const path = `${user!.id}/${busId}/${key}.${ext}`;
    const { error } = await supabase.storage.from('bus-documents').upload(path, file);
    if (error) throw error;
    await supabase.from('bus_documents').insert({
      bus_id: busId,
      document_type: key,
      file_path: path,
      file_name: file.name,
    });
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const { data: bus, error: busError } = await supabase.from('buses').insert({
        owner_id: user.id,
        bus_name: form.busName.trim(),
        operator_name: form.operatorName.trim(),
        bus_type: form.busType,
        total_berths: form.totalBerths,
        registration_number: form.registrationNumber.trim().toUpperCase(),
        business_type: form.businessType,
        address: form.address.trim(),
        city: form.city.trim(),
        landmark: form.landmark.trim(),
        parking_location: form.parkingLocation.trim(),
        price_per_hour: form.pricePerHour,
        night_package_price: form.nightPackagePrice,
        weekend_price: form.weekendPrice,
        discount_enabled: form.discountEnabled,
        amenities: form.amenities,
        secure_parking: form.secureParkingConfirmed,
        available_days: form.availableDays,
        time_slot_start: form.timeSlotStart,
        time_slot_end: form.timeSlotEnd,
        recurring_availability: form.recurringAvailability,
        status: 'pending',
      }).select('id').single();

      if (busError) throw busError;

      // Upload files
      const uploadPromises = Object.entries(files)
        .filter(([, file]) => file)
        .map(([key, file]) => uploadFile(bus.id, key, file!));
      await Promise.all(uploadPromises);

      toast({ title: 'Bus registered!', description: 'Your bus is submitted for verification.' });
      navigate('/owner/buses');
    } catch (err: any) {
      console.error(err);
      const msg = err.message?.includes('buses_registration_number_unique')
        ? 'This registration number is already listed'
        : err.message || 'Failed to register bus';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full';
  const labelClass = 'block text-sm font-medium text-foreground mb-1.5';

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-bold text-foreground">Owner Details</h2>
            <div>
              <label className={labelClass}>Full Name *</label>
              <Input className={inputClass} value={form.ownerName} onChange={e => updateForm({ ownerName: e.target.value })} placeholder="Your full name" />
            </div>
            <div>
              <label className={labelClass}>Phone Number *</label>
              <Input className={inputClass} value={form.ownerPhone} onChange={e => updateForm({ ownerPhone: e.target.value })} placeholder="+91 9876543210" />
            </div>
            <div>
              <label className={labelClass}>Email *</label>
              <Input className={inputClass} type="email" value={form.ownerEmail} onChange={e => updateForm({ ownerEmail: e.target.value })} placeholder="you@email.com" />
            </div>
            <div>
              <label className={labelClass}>Business Type</label>
              <div className="grid grid-cols-2 gap-3">
                {(['individual', 'company'] as const).map(t => (
                  <button key={t} type="button" onClick={() => updateForm({ businessType: t })}
                    className={`p-3 rounded-xl border-2 text-sm font-semibold capitalize transition-all ${form.businessType === t ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:border-primary/30'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-bold text-foreground">Bus Details</h2>
            <div>
              <label className={labelClass}>Bus Name *</label>
              <Input value={form.busName} onChange={e => updateForm({ busName: e.target.value })} placeholder="e.g. NapExpress Deluxe" />
            </div>
            <div>
              <label className={labelClass}>Operator Name</label>
              <Input value={form.operatorName} onChange={e => updateForm({ operatorName: e.target.value })} placeholder="Operator name" />
            </div>
            <div>
              <label className={labelClass}>Bus Type *</label>
              <div className="grid grid-cols-3 gap-2">
                {BUS_TYPES.map(t => (
                  <button key={t.value} type="button" onClick={() => updateForm({ busType: t.value })}
                    className={`p-3 rounded-xl border-2 text-xs font-semibold transition-all ${form.busType === t.value ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:border-primary/30'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Total Berths *</label>
                <Input type="number" min={1} max={50} value={form.totalBerths} onChange={e => updateForm({ totalBerths: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <label className={labelClass}>Registration No. *</label>
                <Input value={form.registrationNumber} onChange={e => updateForm({ registrationNumber: e.target.value })} placeholder="MH01AB1234" className="uppercase" />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-bold text-foreground">Location Details</h2>
            <div>
              <label className={labelClass}>Parking Location / Area</label>
              <Input value={form.parkingLocation} onChange={e => updateForm({ parkingLocation: e.target.value })} placeholder="e.g. Near MG Road Metro" />
            </div>
            <div>
              <label className={labelClass}>Address *</label>
              <Input value={form.address} onChange={e => updateForm({ address: e.target.value })} placeholder="Full address" />
            </div>
            <div>
              <label className={labelClass}>City *</label>
              <Input value={form.city} onChange={e => updateForm({ city: e.target.value })} placeholder="City" />
            </div>
            <div>
              <label className={labelClass}>Nearby Landmark</label>
              <Input value={form.landmark} onChange={e => updateForm({ landmark: e.target.value })} placeholder="e.g. Near City Mall" />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-bold text-foreground">Amenities</h2>
            <p className="text-sm text-muted-foreground">Select all amenities available in your bus</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENITIES_LIST.map(a => {
                const checked = form.amenities.includes(a);
                return (
                  <button key={a} type="button"
                    onClick={() => updateForm({ amenities: checked ? form.amenities.filter(x => x !== a) : [...form.amenities, a] })}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all flex items-center gap-2 ${checked ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:border-primary/30'}`}>
                    <Sparkles className={`w-4 h-4 ${checked ? 'text-primary' : ''}`} />
                    {a}
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-5">
            <h2 className="text-xl font-heading font-bold text-foreground">Safety & Verification</h2>
            <p className="text-sm text-muted-foreground">Upload documents to verify your bus</p>
            {[
              { key: 'rc', label: 'Registration Certificate (RC)', icon: Upload },
              { key: 'owner_id', label: 'Owner ID Proof', icon: Upload },
              { key: 'photo_interior', label: 'Bus Interior Photo', icon: Image },
              { key: 'photo_exterior', label: 'Bus Exterior Photo', icon: Image },
            ].map(doc => (
              <div key={doc.key} className="border border-border rounded-xl p-4">
                <label className="text-sm font-medium text-foreground mb-2 block">{doc.label}</label>
                {files[doc.key] ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="truncate flex-1">{files[doc.key]!.name}</span>
                    <button onClick={() => handleFileChange(doc.key, null)} className="text-destructive hover:text-destructive/80">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-primary hover:text-primary/80">
                    <doc.icon className="w-4 h-4" />
                    Choose file
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => handleFileChange(doc.key, e.target.files?.[0] || null)} />
                  </label>
                )}
              </div>
            ))}
            <label className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer">
              <Checkbox checked={form.secureParkingConfirmed} onCheckedChange={v => updateForm({ secureParkingConfirmed: !!v })} />
              <span className="text-sm text-foreground">I confirm this bus is parked in a secure location</span>
            </label>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-bold text-foreground">Pricing Setup</h2>
            <div>
              <label className={labelClass}>Price per Hour (₹) *</label>
              <Input type="number" min={0} value={form.pricePerHour || ''} onChange={e => updateForm({ pricePerHour: parseFloat(e.target.value) || 0 })} placeholder="e.g. 150" />
            </div>
            <div>
              <label className={labelClass}>Night Package Price (₹)</label>
              <Input type="number" min={0} value={form.nightPackagePrice || ''} onChange={e => updateForm({ nightPackagePrice: parseFloat(e.target.value) || 0 })} placeholder="e.g. 800" />
            </div>
            <div>
              <label className={labelClass}>Weekend Price (₹)</label>
              <Input type="number" min={0} value={form.weekendPrice || ''} onChange={e => updateForm({ weekendPrice: parseFloat(e.target.value) || 0 })} placeholder="e.g. 1000" />
            </div>
            <label className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer">
              <Checkbox checked={form.discountEnabled} onCheckedChange={v => updateForm({ discountEnabled: !!v })} />
              <span className="text-sm text-foreground">Enable discount offers</span>
            </label>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-bold text-foreground">Availability</h2>
            <div>
              <label className={labelClass}>Available Days *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DAYS.map(d => {
                  const checked = form.availableDays.includes(d);
                  return (
                    <button key={d} type="button"
                      onClick={() => updateForm({ availableDays: checked ? form.availableDays.filter(x => x !== d) : [...form.availableDays, d] })}
                      className={`p-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${checked ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:border-primary/30'}`}>
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Check-in Time</label>
                <Input type="time" value={form.timeSlotStart} onChange={e => updateForm({ timeSlotStart: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Check-out Time</label>
                <Input type="time" value={form.timeSlotEnd} onChange={e => updateForm({ timeSlotEnd: e.target.value })} />
              </div>
            </div>
            <label className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer">
              <Checkbox checked={form.recurringAvailability} onCheckedChange={v => updateForm({ recurringAvailability: !!v })} />
              <span className="text-sm text-foreground">Recurring weekly availability</span>
            </label>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-heading font-bold text-foreground">Review & Submit</h2>
            <div className="space-y-4">
              {[
                { title: 'Owner', items: [`Name: ${form.ownerName}`, `Phone: ${form.ownerPhone}`, `Email: ${form.ownerEmail}`, `Type: ${form.businessType}`] },
                { title: 'Bus', items: [`${form.busName} (${BUS_TYPES.find(t => t.value === form.busType)?.label})`, `${form.totalBerths} berths`, `Reg: ${form.registrationNumber}`] },
                { title: 'Location', items: [form.address, form.city, form.landmark].filter(Boolean) },
                { title: 'Amenities', items: form.amenities.length ? form.amenities : ['None selected'] },
                { title: 'Pricing', items: [`₹${form.pricePerHour}/hr`, form.nightPackagePrice ? `Night: ₹${form.nightPackagePrice}` : '', form.weekendPrice ? `Weekend: ₹${form.weekendPrice}` : ''].filter(Boolean) },
                { title: 'Availability', items: [form.availableDays.join(', '), `${form.timeSlotStart} - ${form.timeSlotEnd}`] },
                { title: 'Documents', items: Object.entries(files).filter(([, f]) => f).map(([k, f]) => `${k}: ${f!.name}`).concat(Object.entries(files).filter(([, f]) => !f).length ? ['Some documents not uploaded'] : []) },
              ].map(section => (
                <Card key={section.title}>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-2">{section.title}</h3>
                    <ul className="space-y-1">
                      {section.items.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground">{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="p-4 bg-accent/10 rounded-xl border border-accent/30">
              <p className="text-sm text-foreground font-medium">
                ⏳ After submission, your bus will be reviewed and verified before going live.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step indicators */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex items-center">
            <button
              onClick={() => { if (i < step) { setErrors([]); setStep(i); } }}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                i === step ? 'bg-primary text-primary-foreground' :
                i < step ? 'bg-primary/10 text-primary cursor-pointer hover:bg-primary/20' :
                'text-muted-foreground'
              }`}
            >
              <s.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && <div className={`w-4 h-px mx-1 ${i < step ? 'bg-primary' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {errors.length > 0 && (
            <div className="mt-4 p-3 bg-destructive/10 rounded-lg">
              {errors.map((e, i) => (
                <p key={i} className="text-sm text-destructive">{e}</p>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={prevStep} disabled={step === 0}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            {step < 7 ? (
              <Button onClick={nextStep}>
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Submitting...</> : 'Submit for Verification'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterBus;

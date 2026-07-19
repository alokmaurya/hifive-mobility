"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Shield, Globe, Car, Map, Users, Clock, Pencil, ChevronRight, LogOut, X, Check, Camera, Loader2, Plus, Trash2, CreditCard, BadgeCheck } from "lucide-react";
import AppHeader from "@/components/ui/AppHeader";
import BottomNav from "@/components/ui/BottomNav";
import RequireAuth from "@/components/ui/RequireAuth";
import { useProfile } from "@/hooks/useProfile";
import { useCars } from "@/hooks/useCars";
import { useAuth } from "@/contexts/AuthContext";
import { CATEGORY_META } from "@/lib/utils";
import type { TourCategory } from "@/types/tour";
import type { VehicleType, FuelType, Gender } from "@/types/driver";
import type { DriverCar, DriverCarDraft } from "@/types/car";

const VEHICLE_TYPES: { value: VehicleType; label: string }[] = [
  { value: "hatchback", label: "Hatchback" },
  { value: "sedan",     label: "Sedan" },
  { value: "suv",       label: "SUV" },
  { value: "van",       label: "Van" },
  { value: "tempo",     label: "Tempo" },
];

const FUEL_TYPES: { value: FuelType; label: string }[] = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "cng",    label: "CNG" },
  { value: "hybrid", label: "Hybrid" },
  { value: "ev",     label: "Electric (EV)" },
];

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "male",   label: "Male" },
  { value: "female", label: "Female" },
  { value: "other",  label: "Other" },
];

function PhotoUploadButton({
  onFile,
  uploading,
  className = "",
  label = "Upload",
}: {
  onFile: (f: File) => void;
  uploading: boolean;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className={className}
      >
        {uploading
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <><Camera className="w-4 h-4" /><span className="text-xs font-semibold">{label}</span></>
        }
      </button>
    </>
  );
}

const EMPTY_CAR_DRAFT: DriverCarDraft = {
  carBrand: "", vehicleModel: "", vehiclePlate: "", vehicleType: "suv",
  vehicleCapacity: 4, fuelType: "petrol", isAc: true, isPetFriendly: false,
  smokingAllowed: false, luggageCapacityBags: 2, isActive: true,
};

const FUEL_COLORS: Record<string, string> = {
  petrol: "bg-amber-400/10 text-amber-400",
  diesel: "bg-blue-400/10 text-blue-400",
  cng:    "bg-green-400/10 text-green-400",
  hybrid: "bg-teal-400/10 text-teal-400",
  ev:     "bg-emerald-400/10 text-emerald-400",
};

function CarForm({ initial, onSave, onCancel, saving, carId, uploadingCarId, onPhotoUpload }: {
  initial: DriverCarDraft;
  onSave: (d: DriverCarDraft) => void;
  onCancel: () => void;
  saving: boolean;
  carId?: string;
  uploadingCarId: string | null;
  onPhotoUpload?: (carId: string, file: File) => void;
}) {
  const [d, setD] = useState<DriverCarDraft>(initial);
  const [touched, setTouched] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);

  function toggle(key: keyof DriverCarDraft) {
    setD((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  }

  const missing = (!d.carBrand ? "Brand" : "") || (!d.vehicleModel ? "Model" : "") || (!d.vehiclePlate ? "Number Plate" : "");

  return (
    <div className="space-y-3 pt-1">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide block mb-1">Brand <span className="text-red-400">*</span></label>
          <input value={d.carBrand} onChange={(e) => setD(p => ({ ...p, carBrand: e.target.value }))}
            placeholder="e.g. Maruti" className={`w-full px-3 py-2 rounded-xl border bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 ${touched && !d.carBrand ? "border-red-500" : "border-zinc-700"}`} />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide block mb-1">Model <span className="text-red-400">*</span></label>
          <input value={d.vehicleModel} onChange={(e) => setD(p => ({ ...p, vehicleModel: e.target.value }))}
            placeholder="e.g. Ertiga" className={`w-full px-3 py-2 rounded-xl border bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 ${touched && !d.vehicleModel ? "border-red-500" : "border-zinc-700"}`} />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide block mb-1">Number Plate <span className="text-red-400">*</span></label>
        <input value={d.vehiclePlate} onChange={(e) => setD(p => ({ ...p, vehiclePlate: e.target.value.toUpperCase() }))}
          placeholder="e.g. HP 01 AB 1234" className={`w-full px-3 py-2 rounded-xl border bg-zinc-800 text-white text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-yellow-400/50 ${touched && !d.vehiclePlate ? "border-red-500" : "border-zinc-700"}`} />
        {touched && !d.vehiclePlate && <p className="text-[10px] text-red-400 mt-1">Number plate is required</p>}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide block mb-1">Car Type</label>
          <select value={d.vehicleType} onChange={(e) => setD(p => ({ ...p, vehicleType: e.target.value as VehicleType }))}
            className="w-full px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50">
            {VEHICLE_TYPES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide block mb-1">Fuel</label>
          <select value={d.fuelType} onChange={(e) => setD(p => ({ ...p, fuelType: e.target.value as FuelType }))}
            className="w-full px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50">
            {FUEL_TYPES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide block mb-1">Seats</label>
          <input type="number" min={1} max={20} value={d.vehicleCapacity}
            onChange={(e) => setD(p => ({ ...p, vehicleCapacity: Number(e.target.value) }))}
            className="w-full px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide block mb-1">Luggage (bags)</label>
          <input type="number" min={0} max={20} value={d.luggageCapacityBags}
            onChange={(e) => setD(p => ({ ...p, luggageCapacityBags: Number(e.target.value) }))}
            className="w-full px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50" />
        </div>
      </div>

      {/* Amenity toggles */}
      <div className="flex gap-2">
        {[
          { key: "isAc" as const,          emoji: "❄️", label: "AC",       active: d.isAc,          color: "border-blue-400 bg-blue-400/10 text-blue-400" },
          { key: "isPetFriendly" as const,  emoji: "🐾", label: "Pets OK", active: d.isPetFriendly, color: "border-green-400 bg-green-400/10 text-green-400" },
          { key: "smokingAllowed" as const, emoji: "🚬", label: "Smoking", active: d.smokingAllowed, color: "border-orange-400 bg-orange-400/10 text-orange-400" },
        ].map(({ key, emoji, label, active, color }) => (
          <button key={key} type="button" onClick={() => toggle(key)}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl border-2 text-xs font-bold transition-colors ${
              active ? color : "border-zinc-700 bg-zinc-800 text-zinc-500"
            }`}>
            <span>{emoji}</span> {label}
          </button>
        ))}
      </div>

      {/* Car photo (only for existing cars) */}
      {carId && onPhotoUpload && (
        <div>
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide block mb-1">Car Photo</label>
          <input ref={photoRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onPhotoUpload(carId, f); e.target.value = ""; }} />
          <button type="button" onClick={() => photoRef.current?.click()}
            disabled={uploadingCarId === carId}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-60">
            {uploadingCarId === carId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            {d.cabPhoto ? "Change Photo" : "Upload Car Photo"}
          </button>
        </div>
      )}

      {touched && missing && (
        <p className="text-[10px] text-red-400 text-center">Please fill in: {missing}</p>
      )}
      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center gap-1.5">
          <X className="w-4 h-4 text-zinc-400" /><span className="text-sm font-semibold text-zinc-300">Cancel</span>
        </button>
        <button onClick={() => { setTouched(true); if (d.carBrand && d.vehicleModel && d.vehiclePlate) onSave(d); }} disabled={saving}
          className="flex-1 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 flex items-center justify-center gap-1.5">
          <Check className="w-4 h-4 text-black" /><span className="text-sm font-semibold text-black">{saving ? "Saving…" : "Save Car"}</span>
        </button>
      </div>
    </div>
  );
}

function ProfileContent() {
  const router = useRouter();
  const { profile, loading, uploading, updateProfile, uploadDriverPhoto, uploadAadharPhoto } = useProfile();
  const { cars, loading: carsLoading, uploadingCarId, addCar, updateCar, deleteCar, uploadCarPhoto } = useCars();
  const { signOut } = useAuth();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [editingProfile, setEditingProfile] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<Gender>("");
  const [phone, setPhone] = useState("");
  const [yearsExp, setYearsExp] = useState<string>("");
  const [aadharNumber, setAadharNumber] = useState("");

  const [saving, setSaving] = useState(false);

  // Cars management
  const [addingCar, setAddingCar] = useState(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [carSaving, setCarSaving] = useState(false);
  const [deletingCarId, setDeletingCarId] = useState<string | null>(null);

  async function handleAddCar(draft: DriverCarDraft) {
    setCarSaving(true);
    try { await addCar(draft); setAddingCar(false); } catch {}
    setCarSaving(false);
  }

  async function handleUpdateCar(carId: string, draft: DriverCarDraft) {
    setCarSaving(true);
    try { await updateCar(carId, draft); setEditingCarId(null); } catch {}
    setCarSaving(false);
  }

  async function handleDeleteCar(carId: string) {
    setDeletingCarId(carId);
    try { await deleteCar(carId); } catch {}
    setDeletingCarId(null);
  }

  function startProfileEdit() {
    setName(profile?.name ?? "");
    setBio(profile?.bio ?? "");
    setAge(profile?.age != null ? String(profile.age) : "");
    setGender(profile?.gender ?? "");
    setPhone(profile?.phone ?? "");
    setYearsExp(profile?.yearsExperience != null ? String(profile.yearsExperience) : "");
    setAadharNumber(profile?.aadharNumber ?? "");
    setEditingProfile(true);
  }

  async function saveProfileEdit() {
    setSaving(true);
    try {
      await updateProfile({
        name,
        bio,
        age: age ? Number(age) : undefined,
        gender,
        phone,
        yearsExperience: yearsExp ? Number(yearsExp) : undefined,
        aadharNumber,
      });
    } catch {}
    setSaving(false);
    setEditingProfile(false);
  }

  async function handleDriverPhotoUpload(file: File) {
    setUploadError(null);
    try { await uploadDriverPhoto(file); }
    catch (e: unknown) { setUploadError((e as Error).message ?? "Upload failed"); }
  }

  async function handleAadharUpload(side: "front" | "back", file: File) {
    setUploadError(null);
    try { await uploadAadharPhoto(side, file); }
    catch (e: unknown) { setUploadError((e as Error).message ?? "Upload failed"); }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 pb-24">
        <AppHeader title="My Profile" />
        <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-zinc-900 rounded-2xl border border-zinc-800 animate-pulse" />
          ))}
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      <AppHeader title="My Profile" />

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">

        {uploadError && (
          <div className="bg-red-900/30 border border-red-700/50 rounded-2xl px-4 py-3 flex items-center justify-between gap-2">
            <p className="text-red-400 text-sm">{uploadError}</p>
            <button onClick={() => setUploadError(null)}><X className="w-4 h-4 text-red-400" /></button>
          </div>
        )}

        {/* ── Avatar & bio ───────────────────────────────────────────── */}
        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5">
          <div className="flex items-start gap-4">
            {/* Driver photo */}
            <div className="relative shrink-0">
              {profile?.photoUrl ? (
                <img src={profile.photoUrl} alt="Driver" className="w-20 h-20 rounded-2xl object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-3xl font-bold text-black">
                  {profile?.name?.charAt(0).toUpperCase() ?? "?"}
                </div>
              )}
              <PhotoUploadButton
                onFile={handleDriverPhotoUpload}
                uploading={uploading === "photo"}
                label=""
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center hover:bg-zinc-600 transition-colors disabled:opacity-60"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-white">{profile?.name}</h1>
                {profile?.isVerified && <BadgeCheck className="w-5 h-5 text-blue-400 flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-white">{profile?.rating.toFixed(1)}</span>
                <span className="text-xs text-zinc-500">({profile?.totalToursRun} tours)</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                {profile?.gender && (
                  <span className="text-xs text-zinc-400 capitalize">{profile.gender}</span>
                )}
                {profile?.age && (
                  <span className="text-xs text-zinc-400">{profile.age} yrs old</span>
                )}
                {profile?.phone && (
                  <span className="text-xs text-zinc-400">{profile.phone}</span>
                )}
              </div>
            </div>
          </div>

          {!profile?.photoUrl && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-zinc-800/60 rounded-xl border border-dashed border-zinc-700">
              <Camera className="w-4 h-4 text-zinc-500 shrink-0" />
              <p className="text-xs text-zinc-500">Tap the camera icon to upload your profile photo</p>
            </div>
          )}

          {profile?.bio && !editingProfile && (
            <p className="text-sm text-zinc-400 mt-4 leading-relaxed">{profile.bio}</p>
          )}

          {editingProfile ? (
            <div className="mt-4 space-y-3">
              {/* Name */}
              <div>
                <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide block mb-1">Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50" />
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide block mb-1">Age</label>
                  <input type="number" min={18} max={80} value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 35"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide block mb-1">Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50">
                    <option value="">Select</option>
                    {GENDER_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Phone & Experience */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide block mb-1">Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide block mb-1">Exp. (years)</label>
                  <input type="number" min={0} max={50} value={yearsExp}
                    onChange={(e) => setYearsExp(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50" />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide block mb-1">Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
                  placeholder="Tell tourists about yourself…"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400/50" />
              </div>

              <div className="flex gap-2">
                <button onClick={() => setEditingProfile(false)} className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center gap-1.5">
                  <X className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-semibold text-zinc-300">Cancel</span>
                </button>
                <button onClick={saveProfileEdit} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 text-black" />
                  <span className="text-sm font-semibold text-black">{saving ? "Saving…" : "Save"}</span>
                </button>
              </div>
            </div>
          ) : (
            <button onClick={startProfileEdit} className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors">
              <Pencil className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-semibold text-zinc-300">Edit Profile</span>
            </button>
          )}
        </div>

        {/* ── Stats ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Map,   label: "Tours Run",      value: profile?.totalToursRun ?? 0 },
            { icon: Users, label: "Guests Hosted",  value: profile?.totalGuestsHosted ?? 0 },
            { icon: Clock, label: "Yrs Experience", value: profile?.yearsExperience ?? 0 },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-zinc-900 rounded-2xl p-3 border border-zinc-800 text-center">
              <div className="bg-yellow-400/10 w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                <Icon className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-lg font-bold text-white">{value}</p>
              <p className="text-[10px] text-zinc-500 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Aadhar Card ───────────────────────────────────────────── */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
            <CreditCard className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-bold text-white">Aadhar Card</span>
          </div>
          <div className="p-4 space-y-4">
            {/* Aadhar Number */}
            <div>
              <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide block mb-1.5">Aadhar Number</label>
              {editingProfile ? (
                <input
                  value={aadharNumber}
                  onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, "").slice(0, 12))}
                  placeholder="12-digit Aadhar number"
                  maxLength={12}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                />
              ) : (
                <p className="text-sm font-mono text-zinc-300 bg-zinc-800 px-3 py-2 rounded-xl border border-zinc-700">
                  {profile?.aadharNumber
                    ? profile.aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3")
                    : <span className="text-zinc-600 italic">Not added</span>}
                </p>
              )}
            </div>

            {/* Aadhar photos */}
            <div className="grid grid-cols-2 gap-3">
              {(["front", "back"] as const).map((side) => {
                const url = side === "front" ? profile?.aadharFrontUrl : profile?.aadharBackUrl;
                const isUploading = uploading === `aadhar_${side}`;
                return (
                  <div key={side}>
                    <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide block mb-1.5">
                      {side === "front" ? "Front Side" : "Back Side"}
                    </label>
                    <div className="relative rounded-xl overflow-hidden border border-zinc-700 bg-zinc-800 aspect-[1.6/1]">
                      {url ? (
                        <img src={url} alt={`Aadhar ${side}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                          <CreditCard className="w-6 h-6 text-zinc-600" />
                          <span className="text-[10px] text-zinc-600">No photo</span>
                        </div>
                      )}
                      <PhotoUploadButton
                        onFile={(f) => handleAadharUpload(side, f)}
                        uploading={isUploading}
                        label={url ? "Change" : "Upload"}
                        className="absolute bottom-1.5 right-1.5 flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-900/80 text-zinc-300 text-[10px] font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-60"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {!editingProfile && (
              <button onClick={startProfileEdit} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors">
                <Pencil className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-semibold text-zinc-300">Edit Aadhar Number</span>
              </button>
            )}
          </div>
        </div>

        {/* ── My Cars ───────────────────────────────────────────────── */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-bold text-white">My Cars</span>
              {!carsLoading && <span className="text-xs text-zinc-500">({cars.length})</span>}
            </div>
            {!addingCar && !editingCarId && (
              <button onClick={() => setAddingCar(true)}
                className="flex items-center gap-1 text-xs font-semibold text-black bg-yellow-400 px-3 py-1.5 rounded-full hover:bg-yellow-300 transition-colors">
                <Plus className="w-3 h-3" /> Add Car
              </button>
            )}
          </div>

          <div className="p-4 space-y-3">
            {addingCar && (
              <div className="border border-zinc-700 rounded-2xl p-3 bg-zinc-800/50">
                <p className="text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wide">New Car</p>
                <CarForm
                  initial={EMPTY_CAR_DRAFT}
                  onSave={handleAddCar}
                  onCancel={() => setAddingCar(false)}
                  saving={carSaving}
                  uploadingCarId={uploadingCarId}
                />
              </div>
            )}

            {carsLoading && !addingCar && (
              <div className="space-y-2">
                {[1, 2].map((i) => <div key={i} className="h-20 bg-zinc-800 rounded-xl animate-pulse" />)}
              </div>
            )}

            {!carsLoading && cars.length === 0 && !addingCar && (
              <div className="text-center py-8">
                <Car className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
                <p className="text-zinc-500 text-sm">No cars added yet</p>
                <p className="text-zinc-600 text-xs mt-1">Add your cars to assign them when creating tours</p>
              </div>
            )}

            {cars.map((car: DriverCar) => (
              <div key={car.id} className={`border rounded-2xl overflow-hidden transition-colors ${
                editingCarId === car.id ? "border-yellow-400/50 bg-zinc-800/60" : "border-zinc-800 bg-zinc-800/30"
              }`}>
                {editingCarId === car.id ? (
                  <div className="p-3">
                    <p className="text-xs font-bold text-yellow-400 mb-3 uppercase tracking-wide">Editing Car</p>
                    <CarForm
                      initial={{
                        carBrand: car.carBrand, vehicleModel: car.vehicleModel, vehiclePlate: car.vehiclePlate,
                        vehicleType: car.vehicleType, vehicleCapacity: car.vehicleCapacity, fuelType: car.fuelType,
                        isAc: car.isAc, isPetFriendly: car.isPetFriendly, smokingAllowed: car.smokingAllowed,
                        luggageCapacityBags: car.luggageCapacityBags, cabPhoto: car.cabPhoto, isActive: car.isActive,
                      }}
                      onSave={(d) => handleUpdateCar(car.id, d)}
                      onCancel={() => setEditingCarId(null)}
                      saving={carSaving}
                      carId={car.id}
                      uploadingCarId={uploadingCarId}
                      onPhotoUpload={uploadCarPhoto}
                    />
                  </div>
                ) : (
                  <div className="flex gap-3 p-3">
                    {car.cabPhoto ? (
                      <img src={car.cabPhoto} alt={car.vehicleModel} className="w-20 h-16 object-cover rounded-xl flex-shrink-0" />
                    ) : (
                      <div className="w-20 h-16 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
                        <Car className="w-6 h-6 text-zinc-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <p className="text-sm font-bold text-white leading-tight">{car.carBrand} {car.vehicleModel}</p>
                          <p className="text-xs font-mono text-zinc-500 mt-0.5">{car.vehiclePlate}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${FUEL_COLORS[car.fuelType] ?? "bg-zinc-700 text-zinc-400"}`}>
                          {car.fuelType.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{car.vehicleCapacity} seats · {car.vehicleType}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {car.isAc && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-400/10 text-blue-400 font-semibold">❄️ AC</span>}
                        {car.isPetFriendly && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-400/10 text-green-400 font-semibold">🐾 Pets</span>}
                        {car.smokingAllowed && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-400/10 text-orange-400 font-semibold">🚬</span>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button onClick={() => setEditingCarId(car.id)}
                        className="w-8 h-8 rounded-xl bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center transition-colors">
                        <Pencil className="w-3.5 h-3.5 text-zinc-300" />
                      </button>
                      <button onClick={() => handleDeleteCar(car.id)} disabled={deletingCarId === car.id}
                        className="w-8 h-8 rounded-xl bg-zinc-700 hover:bg-red-900/50 flex items-center justify-center transition-colors disabled:opacity-50">
                        {deletingCarId === car.id
                          ? <Loader2 className="w-3.5 h-3.5 text-zinc-400 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5 text-red-400" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Languages & Specialties ────────────────────────────────── */}
        {((profile?.languages?.length ?? 0) > 0 || (profile?.specialties?.length ?? 0) > 0) && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 space-y-4">
            {(profile?.languages?.length ?? 0) > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm font-bold text-white">Languages</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profile!.languages.map((lang) => (
                    <span key={lang} className="text-xs bg-zinc-800 text-zinc-300 font-medium px-2.5 py-1 rounded-full border border-zinc-700">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {(profile?.specialties?.length ?? 0) > 0 && (
              <div>
                <p className="text-sm font-bold text-white mb-2">Tour Specialties</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile!.specialties.map((cat) => {
                    const meta = CATEGORY_META[cat as TourCategory];
                    return (
                      <span key={cat} className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                        {meta?.emoji} {meta?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Settings ───────────────────────────────────────────────── */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          {[
            { label: "Bank & Payouts",      icon: "💳", href: null },
            { label: "Notifications",       icon: "🔔", href: null },
            { label: "Documents & License", icon: "📄", href: null },
            { label: "Help & Support",      icon: "💬", href: "/support" },
          ].map(({ label, icon, href }) => (
            <button key={label} onClick={() => href && router.push(href)} className="w-full flex items-center justify-between px-4 py-3.5 border-b border-zinc-800 last:border-none hover:bg-zinc-800 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-lg">{icon}</span>
                <span className="text-sm font-medium text-zinc-300">{label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </button>
          ))}
        </div>

        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-400/20 bg-red-400/5 hover:bg-red-400/10 transition-colors"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span className="text-sm font-semibold text-red-400">Sign Out</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}

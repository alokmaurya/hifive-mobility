"use client";

import { MapPin, ChevronDown } from "lucide-react";
import type { TourDraft } from "@/types/tour";

const STATE_CITIES: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool","Tirupati","Kakinada","Rajahmundry","Kadapa","Anantapur"],
  "Arunachal Pradesh": ["Itanagar","Naharlagun","Pasighat","Tawang","Ziro","Along","Bomdila"],
  "Assam": ["Guwahati","Silchar","Dibrugarh","Jorhat","Nagaon","Tinsukia","Tezpur","Sivasagar","Dhubri","Bongaigaon"],
  "Bihar": ["Patna","Gaya","Bhagalpur","Muzaffarpur","Purnia","Darbhanga","Bihar Sharif","Arrah","Begusarai","Katihar"],
  "Chhattisgarh": ["Raipur","Bhilai","Bilaspur","Korba","Durg","Rajnandgaon","Jagdalpur","Raigarh","Ambikapur","Dhamtari"],
  "Goa": ["Panaji","Margao","Vasco da Gama","Mapusa","Ponda","Bicholim","Curchorem","Canacona"],
  "Gujarat": ["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar","Junagadh","Gandhinagar","Anand","Nadiad","Bharuch","Morbi","Kutch","Porbandar","Dwarka"],
  "Haryana": ["Faridabad","Gurgaon","Panipat","Ambala","Yamunanagar","Rohtak","Hisar","Karnal","Sonipat","Panchkula","Bhiwani","Sirsa"],
  "Himachal Pradesh": ["Shimla","Manali","Dharamshala","Kullu","Mandi","Solan","Baddi","Palampur","Dalhousie","Kasauli","Chamba","Spiti","Kinnaur"],
  "Jharkhand": ["Ranchi","Jamshedpur","Dhanbad","Bokaro","Deoghar","Phusro","Hazaribagh","Giridih","Ramgarh","Medininagar"],
  "Karnataka": ["Bengaluru","Mysuru","Mangaluru","Hubballi","Belagavi","Davanagere","Ballari","Vijayapura","Tumakuru","Shivamogga","Udupi","Coorg","Hampi","Badami"],
  "Kerala": ["Thiruvananthapuram","Kochi","Kozhikode","Thrissur","Kollam","Palakkad","Alappuzha","Kannur","Kottayam","Malappuram","Munnar","Thekkady","Wayanad"],
  "Madhya Pradesh": ["Indore","Bhopal","Jabalpur","Gwalior","Ujjain","Sagar","Dewas","Satna","Ratlam","Rewa","Murwara","Singrauli","Pachmarhi","Orchha","Khajuraho"],
  "Maharashtra": ["Mumbai","Pune","Nagpur","Thane","Nashik","Aurangabad","Solapur","Amravati","Navi Mumbai","Kolhapur","Mahabaleshwar","Lonavala","Shirdi","Alibaug","Matheran"],
  "Manipur": ["Imphal","Thoubal","Bishnupur","Churachandpur","Ukhrul","Senapati"],
  "Meghalaya": ["Shillong","Tura","Nongstoin","Jowai","Baghmara","Cherrapunji"],
  "Mizoram": ["Aizawl","Lunglei","Champhai","Kolasib","Serchhip"],
  "Nagaland": ["Kohima","Dimapur","Mokokchung","Tuensang","Wokha","Zunheboto"],
  "Odisha": ["Bhubaneswar","Cuttack","Rourkela","Brahmapur","Sambalpur","Puri","Balasore","Bhadrak","Baripada","Jharsuguda","Konark","Chilika"],
  "Punjab": ["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Mohali","Firozpur","Hoshiarpur","Gurdaspur","Fatehgarh Sahib"],
  "Rajasthan": ["Jaipur","Jodhpur","Udaipur","Kota","Bikaner","Ajmer","Alwar","Jaisalmer","Pushkar","Mount Abu","Chittorgarh","Ranthambore","Bharatpur","Sikar"],
  "Sikkim": ["Gangtok","Namchi","Geyzing","Mangan","Ravangla","Pelling","Lachung","Yuksom"],
  "Tamil Nadu": ["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli","Erode","Vellore","Thanjavur","Tirupur","Ooty","Kodaikanal","Kanyakumari","Mahabalipuram","Rameswaram"],
  "Telangana": ["Hyderabad","Warangal","Nizamabad","Karimnagar","Ramagundam","Khammam","Mahbubnagar","Nalgonda","Adilabad","Suryapet"],
  "Tripura": ["Agartala","Dharmanagar","Udaipur","Kailasahar","Belonia","Sabroom"],
  "Uttar Pradesh": ["Lucknow","Kanpur","Ghaziabad","Agra","Meerut","Varanasi","Allahabad","Bareilly","Aligarh","Moradabad","Mathura","Vrindavan","Ayodhya","Gorakhpur","Noida","Rishikesh"],
  "Uttarakhand": ["Dehradun","Haridwar","Rishikesh","Nainital","Mussoorie","Roorkee","Haldwani","Kashipur","Rudrapur","Auli","Jim Corbett","Kedarnath","Badrinath","Chakrata"],
  "West Bengal": ["Kolkata","Asansol","Siliguri","Durgapur","Bardhaman","Malda","Baharampur","Habra","Kharagpur","Shantiniketan","Darjeeling","Sundarbans","Digha"],
  "Delhi": ["New Delhi","Dwarka","Rohini","Janakpuri","Lajpat Nagar","Saket","Vasant Kunj","Connaught Place","Karol Bagh","Chandni Chowk"],
  "Jammu & Kashmir": ["Srinagar","Jammu","Anantnag","Baramulla","Udhampur","Kathua","Sopore","Gulmarg","Pahalgam","Sonamarg","Leh"],
  "Ladakh": ["Leh","Kargil","Nubra","Zanskar","Pangong"],
  "Puducherry": ["Puducherry","Karaikal","Mahe","Yanam"],
  "Chandigarh": ["Chandigarh"],
};

const INDIAN_STATES = Object.keys(STATE_CITIES).sort();

interface Props {
  draft: TourDraft;
  dispatch: (a: { type: string; payload: unknown }) => void;
}

export default function Step1Location({ draft, dispatch }: Props) {
  const cities = draft.state ? (STATE_CITIES[draft.state] ?? []) : [];

  function handleStateChange(state: string) {
    dispatch({ type: "SET_FIELD", payload: { key: "state", value: state } });
    dispatch({ type: "SET_FIELD", payload: { key: "city", value: "" } });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Where do you operate?</h2>
        <p className="text-slate-500 text-sm mt-1">Select the state and city where you offer tours.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-2">
            State *
          </label>
          <div className="relative">
            <select
              value={draft.state}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full appearance-none px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm font-medium pr-10"
            >
              <option value="">Select state…</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-2">
            <MapPin className="w-3 h-3" /> City *
          </label>
          <div className="relative">
            <select
              value={draft.city}
              onChange={(e) => dispatch({ type: "SET_FIELD", payload: { key: "city", value: e.target.value } })}
              disabled={!draft.state}
              className="w-full appearance-none px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm font-medium pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">{draft.state ? "Select city…" : "Select a state first"}</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {draft.city && draft.state && (
        <div className="bg-indigo-50 rounded-2xl px-4 py-3 flex items-center gap-2 border border-indigo-100">
          <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
          <p className="text-indigo-700 text-sm font-semibold">{draft.city}, {draft.state}</p>
        </div>
      )}
    </div>
  );
}

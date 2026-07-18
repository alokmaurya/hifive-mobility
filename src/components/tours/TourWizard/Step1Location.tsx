"use client";

import { MapPin, ChevronDown } from "lucide-react";
import type { TourDraft } from "@/types/tour";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand",
  "West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry","Chandigarh",
];

const CITIES_BY_STATE: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool","Rajahmundry","Tirupati","Kakinada","Anantapur","Eluru"],
  "Arunachal Pradesh": ["Itanagar","Naharlagun","Pasighat","Tawang","Ziro"],
  "Assam": ["Guwahati","Silchar","Dibrugarh","Jorhat","Nagaon","Tinsukia","Tezpur","Bongaigaon","Dhubri","Karimganj"],
  "Bihar": ["Patna","Gaya","Muzaffarpur","Bhagalpur","Darbhanga","Purnia","Arrah","Begusarai","Katihar","Munger"],
  "Chhattisgarh": ["Raipur","Bhilai","Bilaspur","Durg","Korba","Rajnandgaon","Jagdalpur","Ambikapur","Raigarh","Dhamtari"],
  "Goa": ["Panaji","Margao","Vasco da Gama","Mapusa","Ponda","Calangute","Anjuna","Arambol","Colva","Baga"],
  "Gujarat": ["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar","Junagadh","Gandhinagar","Anand","Navsari","Dwarka","Somnath","Kutch","Statue of Unity"],
  "Haryana": ["Faridabad","Gurugram","Panipat","Ambala","Yamunanagar","Rohtak","Hisar","Karnal","Sonipat","Panchkula","Kurukshetra"],
  "Himachal Pradesh": ["Shimla","Manali","Dharamshala","Kullu","Mandi","Solan","Kangra","Chamba","Dalhousie","Kasauli","Kasol","Spiti"],
  "Jharkhand": ["Ranchi","Jamshedpur","Dhanbad","Bokaro","Deoghar","Hazaribagh","Giridih","Ramgarh","Medininagar","Chatra"],
  "Karnataka": ["Bangalore","Mysuru","Mangaluru","Hubli","Belagavi","Kalaburagi","Ballari","Vijayapura","Shivamogga","Tumakuru","Coorg","Hampi","Badami","Gokarna","Udupi"],
  "Kerala": ["Thiruvananthapuram","Kochi","Kozhikode","Thrissur","Kannur","Kollam","Alappuzha","Palakkad","Munnar","Thekkady","Wayanad","Varkala"],
  "Madhya Pradesh": ["Bhopal","Indore","Jabalpur","Gwalior","Ujjain","Sagar","Dewas","Satna","Ratlam","Rewa","Khajuraho","Orchha","Pachmarhi","Kanha","Bandhavgarh"],
  "Maharashtra": ["Mumbai","Pune","Nagpur","Thane","Nashik","Aurangabad","Solapur","Kolhapur","Amravati","Nanded","Lonavala","Mahabaleshwar","Alibag","Shirdi","Ajanta","Ellora"],
  "Manipur": ["Imphal","Churachandpur","Thoubal","Bishnupur","Senapati"],
  "Meghalaya": ["Shillong","Tura","Jowai","Cherrapunji","Mawlynnong"],
  "Mizoram": ["Aizawl","Lunglei","Saiha","Champhai","Kolasib"],
  "Nagaland": ["Kohima","Dimapur","Mokokchung","Tuensang","Wokha"],
  "Odisha": ["Bhubaneswar","Cuttack","Rourkela","Berhampur","Sambalpur","Puri","Konark","Chilika","Koraput"],
  "Punjab": ["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Mohali","Pathankot","Hoshiarpur","Gurdaspur","Ferozepur"],
  "Rajasthan": ["Jaipur","Jodhpur","Udaipur","Kota","Bikaner","Ajmer","Bhilwara","Alwar","Bharatpur","Sikar","Pushkar","Jaisalmer","Mount Abu","Chittorgarh","Ranthambore"],
  "Sikkim": ["Gangtok","Namchi","Geyzing","Mangan","Lachung","Pelling"],
  "Tamil Nadu": ["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli","Tiruppur","Erode","Vellore","Thoothukudi","Ooty","Kodaikanal","Mahabalipuram","Kanyakumari","Rameswaram","Thanjavur"],
  "Telangana": ["Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam","Ramagundam","Secunderabad","Mahbubnagar","Nalgonda"],
  "Tripura": ["Agartala","Udaipur","Dharmanagar","Kailasahar","Belonia"],
  "Uttar Pradesh": ["Lucknow","Kanpur","Ghaziabad","Agra","Meerut","Varanasi","Prayagraj","Bareilly","Aligarh","Moradabad","Mathura","Vrindavan","Ayodhya","Jhansi","Gorakhpur","Noida","Greater Noida"],
  "Uttarakhand": ["Dehradun","Haridwar","Rishikesh","Nainital","Mussoorie","Roorkee","Haldwani","Kashipur","Rudrapur","Almora","Auli","Jim Corbett","Chopta","Kedarnath","Badrinath"],
  "West Bengal": ["Kolkata","Howrah","Durgapur","Asansol","Siliguri","Bardhaman","Malda","Baharampur","Habra","Kharagpur","Darjeeling","Kalimpong","Sundarbans","Digha"],
  "Delhi": ["New Delhi","Central Delhi","South Delhi","North Delhi","East Delhi","West Delhi","Dwarka","Rohini","Noida Extension","Connaught Place"],
  "Jammu & Kashmir": ["Srinagar","Jammu","Pahalgam","Gulmarg","Sonamarg","Leh","Kargil","Anantnag","Baramulla","Udhampur"],
  "Ladakh": ["Leh","Kargil","Nubra Valley","Pangong","Zanskar","Hanle"],
  "Puducherry": ["Puducherry","Karaikal","Mahe","Yanam"],
  "Chandigarh": ["Chandigarh"],
};

interface Props {
  draft: TourDraft;
  dispatch: (a: { type: string; payload: unknown }) => void;
}

export default function Step1Location({ draft, dispatch }: Props) {
  const cities = draft.state ? (CITIES_BY_STATE[draft.state] ?? []) : [];

  function handleStateChange(newState: string) {
    dispatch({ type: "SET_FIELD", payload: { key: "state", value: newState } });
    // Reset city when state changes
    dispatch({ type: "SET_FIELD", payload: { key: "city", value: "" } });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Where do you operate?</h2>
        <p className="text-slate-500 text-sm mt-1">Select the state first, then choose your city.</p>
      </div>

      <div className="space-y-4">
        {/* State dropdown */}
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

        {/* City dropdown — only shown after state is selected */}
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

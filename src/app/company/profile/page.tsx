import { Mail, Phone, Globe, MapPin } from "lucide-react";
import { CompanyCard } from "@/components/card/CompanyCard";

export default function CompanyProfilePage() {
  return (
    <>
      {/* Company Profile */}
      <main className="max-w-6xl mx-auto px-12 py-12 mt-16 bg-white rounded-xl shadow-md space-y-10">
        <h1 className="text-3xl font-bold text-center">Domtao Company</h1>

        <div className="flex flex-col md:flex-row justify-between gap-8">
            {/* Logo */}
            <div className="w-full md:w-1/4 flex justify-center md:justify-start">
                <div className="w-48 h-48 bg-gray-200 rounded-md" />
            </div>

            {/* Address */}
            <div className="w-full md:w-1/2 text-sm space-y-1">
                <p className="font-medium">Address :</p>
                <p className="font-medium leading-relaxed">99/12 Soi Sukhumvit 71, Khlong Tan Nuea, Watthana, Bangkok 10110, Thailand</p>
            </div>

            {/* Contact Info */}
            <div className="fit-content w-full max-h-fit md:w-1/4 bg-gray-100 p-4 rounded-md text-sm space-y-2">
            <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 shrink-0" />
                www.domtao.com
            </p>
            <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                hom@domtao.com
            </p>
            <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                DomtaoThailand
            </p>
            <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                0202020202
            </p>
            </div>
        </div>

        {/* Company Description */}
        <p className="text-sm text-gray-700 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
        </p>
        </main>

        <main className="max-w-6xl mx-auto px-6 py-12 mt-16 bg-white rounded-xl shadow-md space-y-10">
            <h1 className="text-3xl font-bold text-center">Job Listings</h1>

            {/* Job Listings */}
            {/* <CompanyCard></CompanyCard> */}
        </main>

    </>
  );
}

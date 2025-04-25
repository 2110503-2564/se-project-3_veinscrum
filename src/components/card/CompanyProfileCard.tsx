import { GlobeIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import Image from "next/image";
import { TextEditor } from "../input/TextEditor";

interface CompanyProfileCard {
  me: User;
  company?: Company;
  className?: string;
}

export const CompanyProfileCard: React.FC<CompanyProfileCard> = ({
  me,
  company,
}) => {
  return (
    <div className="space-y-8 gap-x-8 md:grid md:grid-cols-3">
      <div className="flex w-full items-start justify-center">
        <Image
          src={company?.logo || "/placeholder.png"}
          alt={company?.name || "Company Logo"}
          width={192}
          height={192}
          className="rounded-md object-contain"
        />
      </div>

      <div className="col-span-2 w-full space-y-4">
        <div className="space-y-2 rounded-lg bg-gray-100 p-4 text-sm">
          <p className="flex items-center gap-x-3">
            <MapPinIcon className="size-5 text-gray-600" />
            {company?.address}
          </p>
          <p className="flex items-center gap-x-3">
            <MailIcon className="size-5 text-gray-600" />
            {me?.email}
          </p>
          <p className="flex items-center gap-x-3">
            <GlobeIcon className="size-5 text-gray-600" />
            {company?.website}
          </p>
          <p className="flex items-center gap-x-3">
            <PhoneIcon className="size-5 text-gray-600" />
            {company?.tel}
          </p>
        </div>

        <TextEditor
          key={company?.description}
          markdown={company?.description}
          readOnly
        />
      </div>
    </div>
  );
};

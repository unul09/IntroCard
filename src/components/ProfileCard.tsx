import { Phone, Mail } from 'lucide-react';

interface ProfileCardProps {
  image?: string;
  phone?: string;
  email?: string;
  github?: string;
  insta?: string;
  velog?: string;
}

export default function ProfileCard({
  image,
  phone,
  email,
  github,
  insta,
  velog,
}: ProfileCardProps) {
  return (
    <div className="w-[450px]">
      <div className="w-[450px] h-[450px] overflow-hidden rounded mb-4">
        <img
          src={image || '/someone.png'}
          alt="card image"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex justify-between items-end mt-3">
        <div className="text-sm text-black flex flex-col gap-1">
          <p className="text-gray-500 mb-3">contact via</p>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-gray-800" />
            <span>{phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-800" />
            <span>{email}</span>
          </div>
        </div>

        <div className="flex gap-4 ml-6">
          {insta && <img src="/icons/instagram.png" alt="Instagram" className="w-[50px] h-[50px] rounded-full" />}
          {github && <img src="/icons/github.png" alt="GitHub" className="w-[50px] h-[50px] rounded-full object-cover" />}
          {velog && <img src="/icons/velog.png" alt="Velog" className="w-[50px] h-[50px] rounded-full object-cover" />}
        </div>
      </div>
    </div>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import img1 from "@/assets/donationPage/Background+Border.png";
import img2 from "@/assets/donationPage/Background+Border (1).png";
import img3 from "@/assets/donationPage/Background+Border (2).png";

export function AvatarGroup() {
  return (
    <div className="flex -space-x-4 w-fit">
      <Avatar className="">
        <AvatarImage src={img1} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <Avatar className="">
        <AvatarImage src={img2} />
        <AvatarFallback>VC</AvatarFallback>
      </Avatar>

      <Avatar className="">
        <AvatarImage src={img3} />
        <AvatarFallback>+5</AvatarFallback>
      </Avatar>
    </div>
  );
}

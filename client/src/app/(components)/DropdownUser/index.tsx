import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import Avatar from "../../../../public/default-avatar.png";
import { useLogoutMutation } from "@/redux/features/userAuth";
import { useAppDispatch } from "@/redux/store";
import { setCredentials } from "@/redux/state/auth";
import toast from "react-hot-toast";

type UserDropdownProps = {
  user: string | null;
  avatar?: string | null;
};

export default function UserDropdown({ user, avatar }: UserDropdownProps) {
  const [open, setOpen] = useState<boolean>(false);
  const openRef = useRef<HTMLButtonElement | null>(null);

  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(
        setCredentials({
          user: null,
          accessToken: null,
          roles: [],
          hasLocalPassword: false,
        }),
      );
      toast.success("Logout Success!");
    } catch (err) {
      console.log(err);
      toast.error("Logout Failed!");
    }
  };

  return (
    <div className="relative inline-block w-full max-md:w-20">
      <button
        ref={openRef}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full p-2 gap-2 items-center justify-center cursor-pointer ${
          open ? "rounded-t-[10px] bg-[#262626] text-white" : ""
        }`}
      >
        <Image
          className="ml-1.25 hidden w-8.75 h-8.75 rounded-full border md:block"
          src={avatar ?? Avatar}
          width={8.75}
          height={8.75}
          alt="User avatar"
        />
        <span>{user}</span>
      </button>

      <div
        className={`absolute right-0 top-full z-1000 flex w-full flex-col items-end rounded-b-[10px] bg-[#262626] shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-200 ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2.5 opacity-0"
        }`}
      >
        <button className="cursor-pointer flex w-full justify-end bg-transparent px-3.5 py-2.5 text-white hover:rounded-[10px] hover:bg-[hsl(0,0%,25%)]">
          {" "}
          <Link href="#">Profile</Link>
        </button>

        <button className="cursor-pointer flex w-full justify-end bg-transparent px-3.5 py-2.5 text-white hover:rounded-[10px] hover:bg-[hsl(0,0%,25%)]">
          Settings
        </button>

        <button
          onClick={() => handleLogout()}
          className="cursor-pointer flex w-full justify-end bg-transparent px-3.5 py-2.5 text-white hover:rounded-[10px] hover:bg-[hsl(0,0%,25%)]"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

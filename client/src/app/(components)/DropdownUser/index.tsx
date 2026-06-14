import Image from "next/image";
import { useRef, useState } from "react";
import Avatar from "../../../../public/default-avatar.png";
import { useLogoutMutation } from "@/redux/features/userAuth";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setCredentials } from "@/redux/state/auth";
import toast from "react-hot-toast";
import useOutsideClick from "@/hook/useOutsideClick";
import { useRouter } from "next/navigation";

type UserDropdownProps = {
  user: string | null;
  avatar?: string | null;
};

export default function UserDropdown({ user, avatar }: UserDropdownProps) {
  const [open, setOpen] = useState<boolean>(false);
  const openRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();

  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const { roles } = useAppSelector((state) => state.auth);

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
      toast.success("Logout Success!", {
        style: {
          fontWeight: "600",
          color: "green",
        },
      });
    } catch (err) {
      console.log(err);
      toast.error("Logout Failed!", {
        style: {
          fontWeight: "600",
          color: "red",
        },
      });
    }
  };

  useOutsideClick({ ref: openRef, callback: () => setOpen(false) });

  return (
    <div className="relative inline-block w-full ">
      <button
        ref={openRef}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full p-2 gap-2 items-center justify-center cursor-pointer ${
          open ? "rounded-t-[10px] bg-[hsl(359,100%,65%)] text-white" : ""
        }`}
      >
        <Image
          className="ml-1.25 w-8.75 h-8.75 rounded-full border"
          src={avatar ?? Avatar}
          width={8.75}
          height={8.75}
          alt="User avatar"
        />
        <span className="hidden md:block">{user}</span>
      </button>

      <div
        className={`absolute right-0 z-1000 w-full flex flex-col items-end rounded-b-[10px] bg-[hsl(359,100%,65%)] shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-200 w-auto${
          open
            ? " visible translate-y-0 opacity-100 "
            : " invisible -translate-y-2.5 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={() => router.push("#")}
          className="cursor-pointer flex text-xs md:text-base w-20 md:w-full bg-[hsl(359,100%,65%)] justify-end px-3.5 py-2.5 text-white rounded-tl-[10px] md:rounded-tl-none hover:bg-[hsl(359,100%,55%)] "
        >
          Profile
        </button>
        {roles.toString() === "ADMIN" && (
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="cursor-pointer flex text-xs md:text-base w-20 md:w-full bg-[hsl(359,100%,65%)] justify-end  px-3.5 py-2.5 text-white hover:bg-[hsl(359,100%,55%)]"
          >
            Dashboard
          </button>
        )}

        <button
          type="button"
          onClick={() => router.push("#")}
          className="cursor-pointer flex text-xs md:text-base w-20 md:w-full bg-[hsl(359,100%,65%)] justify-end  px-3.5 py-2.5 text-white hover:bg-[hsl(359,100%,55%)]"
        >
          Settings
        </button>

        <button
          onClick={() => handleLogout()}
          className="cursor-pointer flex w-20 md:w-full text-xs md:text-base bg-[hsl(359,100%,65%)] justify-end  px-3.5 py-2.5 text-white rounded-b-[10px] hover:bg-[hsl(359,100%,55%)]"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { RiHome6Line } from "react-icons/ri";
import { AiOutlineUser } from "react-icons/ai";
import { usePathname } from "next/navigation";
import { IMenuLinks } from "@/modules/project/types/common.types";
import Button from "@/components/common/button/Button";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useEffect, useState } from "react";
import { useGetWindowSize } from "@/hooks/useGetWindowSize";
import { IoChevronBackOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { signOut } from "next-auth/react";
import Logo from "@/components/common/elements/Logo";
// ------------------------------------------------>

type IMenu = {
  children: React.ReactNode;
};

const MenuLinks: Array<IMenuLinks> = [
  {
    icon: <RiHome6Line size={24} />,
    link: "/dashboard",
    name: "Dashboard",
  },
  {
    icon: <AiOutlineUser size={24} />,
    link: "/dashboard/profile",
    name: "Profile",
  },
  // {
  //   icon: <RiSettings4Line size={24} />,
  //   link: "/dashboard/settings",
  //   name: "Setting",
  // },
  // {
  //   icon: <MdOutlineAttachMoney size={24} />,
  //   link: "/dashboard/pricing",
  //   name: "Billing & Plan",
  // },
  // @temp hidden
  // {
  //   icon: <AiOutlineUserAdd size={24} />,
  //   link: "/dashboard/referrals",
  //   name: "Referrals",
  // },
];

const Menu = ({ children }: IMenu) => {
  const [goBack, setGoBack] = React.useState("");
  const { size } = useGetWindowSize();
  const [isCollpased, setIsCollpased] = useState<boolean>(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsCollpased((state) => !state);
  };

  useEffect(() => {
    if (size.width < 600 && size.width != 0) {
      setIsCollpased(true);
    }
  }, [size]);

  React.useEffect(() => {
    const goBackUrl = localStorage.getItem("go-back");
    if (goBackUrl) {
      setGoBack(goBackUrl);
    }
  }, []);

  return (
    <motion.div>
      <div className="flex w-screen h-screen overflow-auto">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ width: isCollpased ? 70 : 250, x: 0, opacity: 1 }}
          transition={{ duration: 0.1 }}
          className={`shadow-md relative ${
            isCollpased ? "w-[70px]" : "w-[250px]"
          }`}
        >
          {/* nav header */}
          {size.width > 600 && (
            <Button
              className="h-9 w-9 absolute top-[calc(50%)] -right-5 z-[999999]"
              variant={"outline"}
              onClick={toggleMenu}
            >
              {isCollpased ? (
                <MdOutlineKeyboardArrowRight size={28} />
              ) : (
                <MdOutlineKeyboardArrowLeft size={28} />
              )}
            </Button>
          )}

          <Logo isCollapsed={isCollpased} />

          {/* Menu Links */}
          <motion.div
            className="pt-5 p-3"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
          >
            <Link href={goBack || "/p/playground"}>
              <Button className="w-full rounded-xl  mb-4">
                <IoChevronBackOutline size={24} />
                {!isCollpased ? "Back to App" : null}
              </Button>
            </Link>

            {MenuLinks.map((item, index) => (
              <motion.div
                className="mb-1"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                key={`${index}-side-menu-items`}
              >
                <Link
                  key={`${index}-side-menu-items-link`}
                  href={item.link}
                  className={`flex p-3 gap-3 items-center rounded-xl hover:bg-primary-nav hover:text-primary-default
                        ${
                          pathname === item.link
                            ? "text-primary-default !bg-primary-nav"
                            : "text-[#7c7c7c]"
                        }
                        `}
                >
                  {item.icon}

                  {!isCollpased ? (
                    <motion.h4
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`font-medium `}
                    >
                      {item.name}
                    </motion.h4>
                  ) : null}
                </Link>
              </motion.div>
            ))}
            <Button
              className="w-full rounded-xl p-4 mt-4"
              rightIcon={<MdLogout size={24} />}
              onClick={() => signOut()}
              variant={"outline"}
            >
              {!isCollpased ? "Logout" : null}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
          className="flex-1 overflow-auto"
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Menu;

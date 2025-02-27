"use client";
import { useSearchParams } from "next/navigation";
import { useAppContext } from "../context/AppContext";
import { useEffect } from "react";

const UserInitializer = () => {
  const searchParams = useSearchParams();
  const user = searchParams.get("user");
  const { setUser } = useAppContext();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return null;
};

export default UserInitializer;

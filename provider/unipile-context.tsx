"use client";

import { useAuthToken } from "@convex-dev/auth/react";
import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type UnipileContext = {
  userId: string;
  isConnected: boolean;
};

export const UnipileContext = createContext({ userId: "", isConnected: false });

export const UnipileIntegration = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const token = useAuthToken();
  const [state, setState] = useState({ userId: "", isConnected: false });

  const isGmailLinked = useQuery(
    api.auth.isConnected,
    state.userId ? { userId: state.userId } : "skip"
  );

  useEffect(() => {
    if (token && isGmailLinked) {
      const jwt = jwtDecode(token);
      const userId = jwt.sub?.split("|").at(0) as string;

      setState({
        userId: userId,
        isConnected: true,
      });
    } else if (token && !isGmailLinked) {
      setState({
        userId: token,
        isConnected: false,
      });
    } else {
      setState({
        userId: "",
        isConnected: false,
      });
    }
  }, [token, isGmailLinked]);

  return <UnipileContext value={state}>{children}</UnipileContext>;
};

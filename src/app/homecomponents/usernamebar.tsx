"use client"
import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react';
import Link from 'next/link'

export default function Profile() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if(!user) return <a href="/api/auth/login">Log In</a>;

  return (
    user && (
      <div>
        <Link href="/userhub">{user.name}</Link>
        <div></div>
        <a href="/api/auth/logout">Log Out</a>
      </div>
    )
    
  );
}


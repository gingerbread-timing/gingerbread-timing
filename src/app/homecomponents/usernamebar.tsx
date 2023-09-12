"use client"
import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react';
import Link from 'next/link'

export default function Profile() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div><h2>Loading...</h2></div>;
  if (error) return <div>{error.message}</div>;
  if(!user) return <a href="/api/auth/login">Log In</a>;

  return (
    user && (
      <div>
        <h2><Link href="/userhub">{user.name}</Link></h2>
        <div></div>
      </div>
    )
    
  );
}


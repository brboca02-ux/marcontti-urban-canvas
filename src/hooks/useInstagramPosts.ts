import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type InstagramPost = {
  id: string;
  image_url: string;
  media_type: "image" | "video";
  thumbnail_url: string | null;
  caption: string;
  post_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

async function fetchPosts(includeInactive = false) {
  let q = supabase.from("instagram_posts")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (!includeInactive) q = q.eq("is_active", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as InstagramPost[];
}


/** Public — active posts only. */
export function usePublicInstagramPosts() {
  return useQuery({
    queryKey: ["instagram_posts", "public"],
    queryFn: () => fetchPosts(false),
    staleTime: 5_000,
    refetchOnWindowFocus: true,
  });
}

/** Admin — all posts. */
export function useAdminInstagramPosts() {
  return useQuery({
    queryKey: ["instagram_posts", "admin"],
    queryFn: () => fetchPosts(true),
    staleTime: 0,
  });
}

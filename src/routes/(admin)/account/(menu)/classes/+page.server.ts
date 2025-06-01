import { error, redirect, fail } from "@sveltejs/kit"
import type { PageServerLoad, Actions } from "./$types"

export const load: PageServerLoad = async ({
  locals: { safeGetSession, supabaseServiceRole },
}) => {
  const { session, user } = await safeGetSession()
  if (!session || !user?.id) {
    redirect(303, "/login")
  }

  // Fetch user's classes
  const { data: classes, error: fetchError } = await supabaseServiceRole
    .from("classes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (fetchError) {
    console.error("Error fetching classes:", fetchError)
    error(500, {
      message: "Failed to load classes. If issue persists, please contact us.",
    })
  }

  return {
    classes: classes || [],
  }
}

export const actions: Actions = {
  delete: async ({ request, locals: { safeGetSession, supabaseServiceRole } }) => {
    const { session, user } = await safeGetSession()
    if (!session || !user?.id) {
      return fail(401, { message: "Unauthorized" })
    }

    const formData = await request.formData()
    const classId = formData.get("id") as string

    if (!classId) {
      return fail(400, { message: "Class ID is required" })
    }

    // Delete the class (RLS policy ensures user can only delete their own classes)
    const { error: deleteError } = await supabaseServiceRole
      .from("classes")
      .delete()
      .eq("id", classId)
      .eq("user_id", user.id)

    if (deleteError) {
      console.error("Error deleting class:", deleteError)
      return fail(500, { message: "Failed to delete class" })
    }

    return { success: true }
  },
}
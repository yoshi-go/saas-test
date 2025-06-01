import { error, redirect, fail } from "@sveltejs/kit"
import type { PageServerLoad, Actions } from "./$types"

export const load: PageServerLoad = async ({
  params,
  locals: { safeGetSession, supabaseServiceRole },
}) => {
  const { session, user } = await safeGetSession()
  if (!session || !user?.id) {
    redirect(303, "/login")
  }

  const classId = params.id

  // Fetch the specific class
  const { data: classData, error: fetchError } = await supabaseServiceRole
    .from("classes")
    .select("*")
    .eq("id", classId)
    .eq("user_id", user.id) // Ensure user can only access their own classes
    .single()

  if (fetchError || !classData) {
    console.error("Error fetching class:", fetchError)
    error(404, { message: "Class not found" })
  }

  return {
    class: classData,
  }
}

export const actions: Actions = {
  default: async ({ params, request, locals: { safeGetSession, supabaseServiceRole } }) => {
    const { session, user } = await safeGetSession()
    if (!session || !user?.id) {
      return fail(401, { message: "Unauthorized" })
    }

    const classId = params.id
    const formData = await request.formData()
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const instructor = formData.get("instructor") as string
    const startDate = formData.get("start_date") as string
    const endDate = formData.get("end_date") as string
    const capacity = formData.get("capacity") as string
    const price = formData.get("price") as string

    // Validation
    if (!name?.trim()) {
      return fail(400, { 
        message: "Class name is required",
        values: { name, description, instructor, startDate, endDate, capacity, price }
      })
    }

    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (end <= start) {
        return fail(400, {
          message: "End date must be after start date",
          values: { name, description, instructor, startDate, endDate, capacity, price }
        })
      }
    }

    // Parse numeric values
    const capacityNum = capacity ? parseInt(capacity) : null
    const priceNum = price ? parseFloat(price) : null

    if (capacity && (isNaN(capacityNum!) || capacityNum! < 1)) {
      return fail(400, {
        message: "Capacity must be a positive number",
        values: { name, description, instructor, startDate, endDate, capacity, price }
      })
    }

    if (price && (isNaN(priceNum!) || priceNum! < 0)) {
      return fail(400, {
        message: "Price must be a non-negative number",
        values: { name, description, instructor, startDate, endDate, capacity, price }
      })
    }

    // Update the class (RLS policy ensures user can only update their own classes)
    const { error: updateError } = await supabaseServiceRole
      .from("classes")
      .update({
        name: name.trim(),
        description: description?.trim() || null,
        instructor: instructor?.trim() || null,
        start_date: startDate || null,
        end_date: endDate || null,
        capacity: capacityNum,
        price: priceNum,
      })
      .eq("id", classId)
      .eq("user_id", user.id)

    if (updateError) {
      console.error("Error updating class:", updateError)
      return fail(500, { 
        message: "Failed to update class. Please try again.",
        values: { name, description, instructor, startDate, endDate, capacity, price }
      })
    }

    redirect(303, "/account/classes")
  },
}
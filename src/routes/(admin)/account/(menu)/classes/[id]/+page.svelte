<script lang="ts">
  import { getContext } from "svelte"
  import { enhance } from "$app/forms"
  import type { Writable } from "svelte/store"
  import type { PageData, ActionData } from "./$types"

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("classes")

  let { data, form }: { data: PageData; form: ActionData } = $props()

  let isSubmitting = $state(false)

  function formatDateTimeLocal(dateString: string | null): string {
    if (!dateString) return ""
    // Convert ISO string to format required by datetime-local input
    return new Date(dateString).toISOString().slice(0, 16)
  }
</script>

<svelte:head>
  <title>Edit Class</title>
</svelte:head>

<div class="mb-6">
  <nav class="breadcrumbs text-sm">
    <ul>
      <li><a href="/account/classes" class="link">Classes</a></li>
      <li>Edit Class</li>
    </ul>
  </nav>
</div>

<div class="max-w-2xl">
  <h1 class="text-2xl font-bold mb-6">Edit Class</h1>

  {#if form?.message}
    <div class="alert alert-error mb-6">
      <span>{form.message}</span>
    </div>
  {/if}

  <form
    method="POST"
    class="space-y-6"
    use:enhance={() => {
      isSubmitting = true
      return async ({ update }) => {
        await update()
        isSubmitting = false
      }
    }}
  >
    <div class="form-control">
      <label for="name" class="label">
        <span class="label-text font-medium">Class Name *</span>
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={data.class.name}
        class="input input-bordered w-full"
        placeholder="e.g., Introduction to Web Development"
        required
        disabled={isSubmitting}
      />
    </div>

    <div class="form-control">
      <label for="description" class="label">
        <span class="label-text font-medium">Description</span>
      </label>
      <textarea
        id="description"
        name="description"
        value={data.class.description || ""}
        class="textarea textarea-bordered h-24"
        placeholder="Describe what students will learn in this class..."
        disabled={isSubmitting}
      ></textarea>
    </div>

    <div class="form-control">
      <label for="instructor" class="label">
        <span class="label-text font-medium">Instructor</span>
      </label>
      <input
        type="text"
        id="instructor"
        name="instructor"
        value={data.class.instructor || ""}
        class="input input-bordered w-full"
        placeholder="e.g., John Smith"
        disabled={isSubmitting}
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-control">
        <label for="start_date" class="label">
          <span class="label-text font-medium">Start Date</span>
        </label>
        <input
          type="datetime-local"
          id="start_date"
          name="start_date"
          value={formatDateTimeLocal(data.class.start_date)}
          class="input input-bordered w-full"
          disabled={isSubmitting}
        />
      </div>

      <div class="form-control">
        <label for="end_date" class="label">
          <span class="label-text font-medium">End Date</span>
        </label>
        <input
          type="datetime-local"
          id="end_date"
          name="end_date"
          value={formatDateTimeLocal(data.class.end_date)}
          class="input input-bordered w-full"
          disabled={isSubmitting}
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-control">
        <label for="capacity" class="label">
          <span class="label-text font-medium">Capacity</span>
        </label>
        <input
          type="number"
          id="capacity"
          name="capacity"
          value={data.class.capacity || ""}
          class="input input-bordered w-full"
          placeholder="e.g., 25"
          min="1"
          disabled={isSubmitting}
        />
        <div class="label">
          <span class="label-text-alt">Maximum number of students</span>
        </div>
      </div>

      <div class="form-control">
        <label for="price" class="label">
          <span class="label-text font-medium">Price</span>
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={data.class.price || ""}
          class="input input-bordered w-full"
          placeholder="e.g., 199.99"
          min="0"
          step="0.01"
          disabled={isSubmitting}
        />
        <div class="label">
          <span class="label-text-alt">Price in USD</span>
        </div>
      </div>
    </div>

    <div class="flex gap-4 pt-4">
      <button type="submit" class="btn btn-primary" disabled={isSubmitting}>
        {#if isSubmitting}
          <span class="loading loading-spinner loading-sm"></span>
          Updating...
        {:else}
          Update Class
        {/if}
      </button>
      <a href="/account/classes" class="btn btn-outline">Cancel</a>
    </div>
  </form>
</div>

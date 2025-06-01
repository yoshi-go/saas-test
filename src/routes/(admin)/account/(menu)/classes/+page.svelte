<script lang="ts">
  import { getContext } from "svelte"
  import { enhance } from "$app/forms"
  import type { Writable } from "svelte/store"
  import type { PageData, ActionData } from "./$types"

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("classes")

  let { data, form }: { data: PageData; form: ActionData } = $props()

  function formatDate(dateString: string | null): string {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString()
  }

  function formatCurrency(price: number | null): string {
    if (price === null || price === undefined) return ""
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  let deleteClassId = $state<string | null>(null)
  let showDeleteModal = $state(false)

  function confirmDelete(classId: string) {
    deleteClassId = classId
    showDeleteModal = true
  }

  function cancelDelete() {
    deleteClassId = null
    showDeleteModal = false
  }
</script>

<svelte:head>
  <title>Classes</title>
</svelte:head>

<div class="flex justify-between items-center mb-6">
  <h1 class="text-2xl font-bold">Classes</h1>
  <a href="/account/classes/create" class="btn btn-primary">
    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
    </svg>
    Create Class
  </a>
</div>

{#if form?.message}
  <div class="alert {form.success ? 'alert-success' : 'alert-error'} mb-4">
    <span>{form.message}</span>
  </div>
{/if}

{#if data.classes.length === 0}
  <div class="text-center py-12">
    <div class="mb-4">
      <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
      </svg>
    </div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">No classes yet</h3>
    <p class="text-gray-500 mb-4">Get started by creating your first class.</p>
    <a href="/account/classes/create" class="btn btn-primary">Create Class</a>
  </div>
{:else}
  <div class="overflow-x-auto">
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th>Name</th>
          <th>Instructor</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Capacity</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each data.classes as classItem}
          <tr>
            <td>
              <div>
                <div class="font-medium">{classItem.name}</div>
                {#if classItem.description}
                  <div class="text-sm text-gray-500 truncate max-w-xs">{classItem.description}</div>
                {/if}
              </div>
            </td>
            <td>{classItem.instructor || "-"}</td>
            <td>{formatDate(classItem.start_date)}</td>
            <td>{formatDate(classItem.end_date)}</td>
            <td>{classItem.capacity || "-"}</td>
            <td>{formatCurrency(classItem.price)}</td>
            <td>
              <div class="flex gap-2">
                <a href="/account/classes/{classItem.id}" class="btn btn-sm btn-outline">
                  Edit
                </a>
                <button 
                  class="btn btn-sm btn-error btn-outline"
                  onclick={() => confirmDelete(classItem.id)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteModal}
  <div class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Confirm Delete</h3>
      <p class="py-4">Are you sure you want to delete this class? This action cannot be undone.</p>
      <div class="modal-action">
        <button class="btn" onclick={cancelDelete}>Cancel</button>
        <form method="POST" action="?/delete" use:enhance>
          <input type="hidden" name="id" value={deleteClassId} />
          <button class="btn btn-error" type="submit">Delete</button>
        </form>
      </div>
    </div>
  </div>
{/if}
"use client";

import { AdminCompanyCard } from "@/components/card/AdminCompanyCard";
import { CompanyCardSkeleton } from "@/components/card/CompanyCardSkeleton";
import { DeleteCompanyProfileDialog } from "@/components/dialog/DeleteCompanyProfileDialog";
import {
  EditCompanyProfileDialog,
  editCompanyProfileFormSchema,
} from "@/components/dialog/EditCompanyProfileDialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/shadcn/pagination";
import { BackendRoutes } from "@/constants/routes/Backend";
import { usePagination } from "@/hooks/usePagination";
import { axios } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function AdminCompaniesPage() {
  const queryClient = useQueryClient();
  const { page, setPage, getQuery } = usePagination({
    initialLimit: 8,
  });

  const [selectedCompany, setSelectCompany] = useState<Company | null>(null);
  const [isUpdateCompanyDialogOpen, setIsUpdateCompanyDialogOpen] =
    useState(false);
  const [isDeleteCompanyDialogOpen, setIsDeleteCompanyDialogOpen] =
    useState(false);

  const { data: companies, isLoading } = useQuery({
    queryKey: [BackendRoutes.COMPANIES, getQuery()],
    queryFn: async () =>
      await axios.get<GETAllCompaniesResponse>(BackendRoutes.COMPANIES, {
        params: getQuery(),
      }),
    select: (data) => data.data,
  });

  // Refresh data helper function
  const refreshCompany = async () => {
    queryClient.invalidateQueries({
      queryKey: [BackendRoutes.COMPANIES],
    });

    // Check if current page is now empty (except for page 1)
    if (page > 1) {
      const currentData = await axios.get<GETAllJobListingsResponse>(
        BackendRoutes.JOB_LISTINGS,
        { params: getQuery() },
      );

      // If the current page has no data after deletion, go to previous page
      if (currentData?.data?.data?.length === 0) {
        setPage(page - 1);
      }
    }
  };

  const { mutate: updateCompany, isPending: isUpdateCompanyPending } =
    useMutation({
      mutationFn: async (data: z.infer<typeof editCompanyProfileFormSchema>) =>
        await axios.put(
          BackendRoutes.COMPANIES_ID({ companyId: selectedCompany?._id ?? "" }),
          data,
        ),
      onMutate: () => {
        toast.loading("Updating company...", { id: "update-company" });
      },
      onError: () => {
        toast.error("Failed to update company", { id: "update-company" });
      },
      onSuccess: () => {
        toast.success("Company updated successfully", { id: "update-company" });
        setSelectCompany(null);
        setIsUpdateCompanyDialogOpen(false);
        refreshCompany();
      },
    });

  const { mutate: deleteCompany, isPending: isDeleteCompanyPending } =
    useMutation({
      mutationFn: async () =>
        await axios.delete(
          BackendRoutes.COMPANIES_ID({ companyId: selectedCompany?._id ?? "" }),
        ),
      onMutate: () => {
        toast.loading("Deleting company...", { id: "delete-company" });
      },
      onError: () => {
        toast.error("Failed to delete company", { id: "delete-company" });
      },
      onSuccess: async () => {
        toast.success("Company deleted successfully", { id: "delete-company" });
        setSelectCompany(null);
        setIsDeleteCompanyDialogOpen(false);
        refreshCompany();
      },
    });

  return (
    <main className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-col justify-between gap-y-16 px-4 py-4 md:py-16">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-center text-4xl font-bold">All Companies</h1>
        </div>
        <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <CompanyCardSkeleton key={i} />
              ))
            : companies?.data.map((company) => (
                <AdminCompanyCard
                  key={company._id}
                  company={company}
                  onUpdate={() => {
                    setSelectCompany(company);
                    setIsUpdateCompanyDialogOpen(true);
                  }}
                  onDelete={() => {
                    setSelectCompany(company);
                    setIsDeleteCompanyDialogOpen(true);
                  }}
                />
              ))}
        </div>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={!companies?.pagination.prev || isLoading}
              onClick={() => setPage(page - 1)}
            />
          </PaginationItem>
          {companies?.pagination.prev && !isLoading && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(page - 1)}>
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink isActive>{page}</PaginationLink>
          </PaginationItem>
          {companies?.pagination.next && !isLoading && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(page + 1)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              disabled={!companies?.pagination.next || isLoading}
              onClick={() => setPage(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {selectedCompany && (
        <EditCompanyProfileDialog
          company={selectedCompany}
          isPending={isUpdateCompanyPending}
          onUpdate={updateCompany}
          isOpen={isUpdateCompanyDialogOpen}
          setIsOpen={setIsUpdateCompanyDialogOpen}
        />
      )}

      {selectedCompany && (
        <DeleteCompanyProfileDialog
          isOpen={isDeleteCompanyDialogOpen}
          isPending={isDeleteCompanyPending}
          onClose={() => setIsDeleteCompanyDialogOpen(false)}
          onDelete={() => {
            deleteCompany();
            setIsDeleteCompanyDialogOpen(false);
          }}
        />
      )}
    </main>
  );
}

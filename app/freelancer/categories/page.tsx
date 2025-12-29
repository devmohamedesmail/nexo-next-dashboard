'use client'

import React from 'react'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import CategoryController from '@/controllers/freelancer/categroies'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslation } from 'react-i18next'

interface Category {
  id: number
  title_en: string
  title_ar: string
}

export default function Categories() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  /* ================= FETCH ================= */
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: CategoryController.getAll,
  })

  /* ================= CREATE ================= */
  const createMutation = useMutation({
    mutationFn: CategoryController.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      formik.resetForm()
    },
  })

  /* ================= DELETE ================= */
  const deleteMutation = useMutation({
    mutationFn: CategoryController.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  /* ================= VALIDATION ================= */
  const validationSchema = Yup.object({
    title_en: Yup.string().required(t("categories.validation.titleEn")),
    title_ar: Yup.string().required(t("categories.validation.titleAr")),
  })

  /* ================= FORM ================= */
  const formik = useFormik({
    initialValues: {
      title_en: '',
      title_ar: '',
    },
    validationSchema,
    onSubmit: (values) => {
      createMutation.mutate(values)
    },
  })

  return (
    <div className="space-y-6">

      {/* ADD CATEGORY */}
      <Dialog>
        <DialogTrigger asChild>
          <Button>{t("categories.add")}</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("categories.add")}</DialogTitle>
          </DialogHeader>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <Label>{t("categories.titleEn")}</Label>
              <Input
                name="title_en"
                value={formik.values.title_en}
                onChange={formik.handleChange}
              />
              {formik.touched.title_en && formik.errors.title_en && (
                <p className="text-red-500 text-sm">{formik.errors.title_en}</p>
              )}
            </div>

            <div>
              <Label>{t("categories.titleAr")}</Label>
              <Input
                name="title_ar"
                value={formik.values.title_ar}
                onChange={formik.handleChange}
              />
              {formik.touched.title_ar && formik.errors.title_ar && (
                <p className="text-red-500 text-sm">{formik.errors.title_ar}</p>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t("common.cancel")}</Button>
              </DialogClose>
              <Button type="submit" disabled={createMutation.isPending}>
                {t("common.save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">{t("categories.titleEn")}</TableHead>
            <TableHead className="text-center">{t("categories.titleAr")}</TableHead>
            <TableHead className="text-center">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((category: Category) => (
            <TableRow key={category.id}>
              <TableCell className="text-center">{category.id}</TableCell>
              <TableCell className="text-center">{category.title_en}</TableCell>
              <TableCell className="text-center">{category.title_ar}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(category.id)}
                >
                  {t("common.delete")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

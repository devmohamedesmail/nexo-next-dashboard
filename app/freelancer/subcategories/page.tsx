'use client'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import SubcategoryController from '@/controllers/freelancer/subcategries'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"



interface Category {
    id: number;
    title_en: string;
    title_ar: string;
    createdAt: string;
}
interface Subcategory {
    id: number;
    title_en: string;
    title_ar: string;
    category_id: number;
    category?: {
        id: number;
        title_en: string;
        title_ar: string;
    };
    createdAt: string;
}
export default function Subcategories() {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    /* ================= FETCH ================= */
    const { data: subcategories } = useQuery({
        queryKey: ['subcategories'],
        queryFn: SubcategoryController.getAll,
    })

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: CategoryController.getAll,
    })

    /* ================= CREATE ================= */
    const createMutation = useMutation({
        mutationFn: SubcategoryController.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subcategories'] })
            formik.resetForm()
        },
    })

    /* ================= DELETE ================= */
    const deleteMutation = useMutation({
        mutationFn: SubcategoryController.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subcategories'] })
        },
    })

    /* ================= FORM ================= */
    const formik = useFormik({
        initialValues: {
            title_en: '',
            title_ar: '',
            category_id: '',
        },
        validationSchema: Yup.object({
            title_en: Yup.string().required(t('categories.validation.titleEn')),
            title_ar: Yup.string().required(t('categories.validation.titleAr')),
            category_id: Yup.string().required(t('categories.validation.category')),
        }),
        onSubmit: (values) => {
            createMutation.mutate({
                title_en: values.title_en,
                title_ar: values.title_ar,
                category_id: Number(values.category_id),
            })
        },
    })

    return (
        <div className="space-y-8 mt-12">

            {/* ADD SUBCATEGORY */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button>{t("categories.add_sub")}</Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("categories.add_sub")}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={formik.handleSubmit} className="space-y-4">

                        <div>
                            <Label>{t("categories.titleEn")}</Label>
                            <Input
                                name="title_en"
                                value={formik.values.title_en}
                                onChange={formik.handleChange}
                            />
                        </div>

                        <div>
                            <Label>{t("categories.titleAr")}</Label>
                            <Input
                                name="title_ar"
                                value={formik.values.title_ar}
                                onChange={formik.handleChange}
                            />
                        </div>

                        <div>
                            <Label>{t("categories.selectcategory")}</Label>
                            <Select
                                onValueChange={(value) =>
                                    formik.setFieldValue('category_id', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t("subcategories.selectCategory")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories?.map((cat: Category) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.title_en}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                        <TableHead>ID</TableHead>
                        <TableHead>{t("categories.titleEn")}</TableHead>
                        <TableHead>{t("categories.titleAr")}</TableHead>
                        <TableHead>{t("categories.category")}</TableHead>
                        <TableHead>{t("common.actions")}</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {subcategories?.map((item: Subcategory) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.title_en}</TableCell>
                            <TableCell>{item.title_ar}</TableCell>
                            <TableCell>{item.category?.title_en}</TableCell>
                            <TableCell>
                                <Button
                                    variant="destructive"
                                    onClick={() => deleteMutation.mutate(item.id)}
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

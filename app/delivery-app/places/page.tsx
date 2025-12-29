'use client'
import React from 'react'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PlaceController from '@/controllers/delivery-app/places-controller';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/context/auth-provider';

interface Place {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
}
export default function Places() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const {user}=useAuth();




    /* ================= FETCH ================= */
    const { data, isLoading } = useQuery({
        queryKey: ["places"],
        queryFn: PlaceController.getPlaces,
    });

    /* ================= CREATE ================= */
    const createMutation = useMutation({
        mutationFn: PlaceController.createPlace,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["places"] });
            formik.resetForm();
        },
    });

    /* ================= DELETE ================= */
    const deleteMutation = useMutation({
        mutationFn: PlaceController.deletePlace,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["places"] });
        },
    });

    /* ================= VALIDATION ================= */
    const validationSchema = Yup.object({
        name: Yup.string().required(t("places.validation.nameRequired")),
        address: Yup.string().required(t("places.validation.addressRequired")),
        latitude: Yup.number()
            // .required()
            .min(-90)
            .max(90),
        longitude: Yup.number()
            // .required()
            .min(-180)
            .max(180),
    });

    /* ================= FORMIK ================= */
    const formik = useFormik({
        initialValues: {
            name: "",
            address: "",
            latitude: "",
            longitude: "",
        },
        validationSchema,
        onSubmit: (values) => {
            console.log(values)
            createMutation.mutate({
                name: values.name,
                address: values.address,
                latitude: Number(values.latitude),
                longitude: Number(values.longitude),
            });
        },
    });

    return (
        <div>


            <Dialog>
                <DialogTrigger asChild>
                    <Button>{t("places.addNewPlace")}</Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("places.addNewPlace")}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div>
                            <Label>{t("places.placeName")}</Label>
                            <Input name="name" onChange={formik.handleChange} value={formik.values.name} />
                        </div>
                        {formik.touched.name && formik.errors.name && (
                            <p className="text-sm text-red-500">
                                {formik.errors.name}
                            </p>
                        )}

                        <div>
                            <Label>{t("places.address")}</Label>
                            <Input name="address" onChange={formik.handleChange} value={formik.values.address} />
                            {formik.touched.address && formik.errors.address && (
                                <p className="text-sm text-red-500">
                                    {formik.errors.address}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>{t("places.latitude")}</Label>
                            <Input type="number" name="latitude" onChange={formik.handleChange} value={formik.values.latitude} />
                            {formik.touched.latitude && formik.errors.latitude && (
                                <p className="text-sm text-red-500">
                                    {formik.errors.latitude}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>{t("places.longitude")}</Label>
                            <Input type="number" name="longitude" onChange={formik.handleChange} value={formik.values.longitude} />
                            {formik.touched.longitude && formik.errors.longitude && (
                                <p className="text-sm text-red-500">
                                    {formik.errors.longitude}
                                </p>
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


            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='text-center'>{t("common.id")}</TableHead>
                        <TableHead className='text-center'>{t("places.placeName")}</TableHead>
                        <TableHead className='text-center'>{t("common.actions")}</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data?.map((place: Place) => (
                        <TableRow key={place.id}>
                            <TableCell className='text-center'>{place.id}</TableCell>
                            <TableCell className='text-center'>{place.name}</TableCell>
                            <TableCell className='text-center'>
                                <Button
                                    variant="destructive"
                                    onClick={() => deleteMutation.mutate(place.id)}
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

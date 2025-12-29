import { config } from "@/constants/config";
import axios from "axios";

interface Place {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
}

export default class PlaceController {

    /**
     * show all places
     * @returns 
     */
    static async getPlaces(): Promise<Place[]> {
        const res = await axios.get(`${config.API_URL}/places`);
        return res.data.data;
    }




    // GET single place
    static async getPlaceById(id: number): Promise<Place> {
        const res = await axios.get(`${config.API_URL}/places/${id}`);
        return res.data;
    }

    // CREATE place
    static async createPlace(data: Omit<Place, "id">): Promise<Place> {
        const res = await axios.post(`${config.API_URL}/places/create`, data);
        return res.data;
    }

    // UPDATE place
    static async updatePlace(
        id: number,
        data: Partial<Omit<Place, "id">>
    ): Promise<Place> {
        const res = await axios.put(`${config.API_URL}/update/${id}`, data);
        return res.data;
    }

    // DELETE place
    static async deletePlace(id: number): Promise<void> {
        await axios.delete(`${config.API_URL}/${id}`);
    }
}
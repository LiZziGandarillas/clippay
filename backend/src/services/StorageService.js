import { supabaseAdmin } from "../config/supabase.js";

export class StorageService {

    static async uploadCampaignImage(file, campaignId) {
        const fileExt = file.originalname.split(".").pop();
        const fileName = `${campaignId}-${Date.now()}.${fileExt}`;
        const filePath = `campaigns/${fileName}`;

        const { data, error } = await supabaseAdmin.storage
            .from("campaign-images")
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
            });

        if (error) throw new Error(`Upload failed: ${error.message}`);

        const { data: urlData } = supabaseAdmin.storage
            .from("campaign-images")
            .getPublicUrl(filePath);

        return urlData.publicUrl;
    }

    static async deleteCampaignImage(imageUrl) {
        const path = imageUrl.split("/campaign-images/")[1];
        if (!path) return;

        const { error } = await supabaseAdmin.storage
            .from("campaign-images")
            .remove([path]);

        if (error) throw new Error(`Delete failed: ${error.message}`);
    }
}

// Service functions for uploading and fetching partners

export interface Partner {
    id: number;
    name: string;
}

export interface FetchPartnersResponse {
    success: boolean;
    partners: Partner[];
}

export interface UploadResponse {
    success: boolean;
    message: string;
    data?: any;
}

// Mock function to fetch partners - replace with actual API call
export const fetchPartners = async (): Promise<FetchPartnersResponse> => {
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data - replace with actual API call
        const partners: Partner[] = [
            { id: 1, name: "HDFC Bank" },
            { id: 2, name: "ICICI Bank" },
            { id: 3, name: "SBI Bank" },
            { id: 4, name: "Axis Bank" },
            { id: 5, name: "Kotak Mahindra" },
        ];

        return {
            success: true,
            partners
        };
    } catch (error) {
        console.error('Error fetching partners:', error);
        throw new Error('Failed to fetch partners');
    }
};

// Mock function to upload raw loader - replace with actual API call
export const uploadRawLoader = async (
    file: File,
    documentType: string,
    partnerId: string,
    configId: string
): Promise<UploadResponse> => {
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock API call - replace with actual implementation
        console.log('Uploading file:', {
            fileName: file.name,
            fileSize: file.size,
            documentType,
            partnerId,
            configId
        });

        // Simulate success response
        return {
            success: true,
            message: `File ${file.name} uploaded successfully`,
            data: {
                fileId: `file_${Date.now()}`,
                uploadedAt: new Date().toISOString()
            }
        };
    } catch (error) {
        console.error('Error uploading raw loader:', error);
        throw new Error('Failed to upload file');
    }
};
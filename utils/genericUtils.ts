import axios from 'axios';
export const formatDate = (departure: string) => {
    const date = new Date(departure);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return {day:`${day}-${month}`, time:`${hours}:${minutes}`};
};
async function uploadImage(imageUri: string): Promise<void> {
    try {
        const fileExtension = imageUri.split('.').pop();
        const fileName = `image_${Date.now()}.${fileExtension}`;

        // Convert the image file to a Blob
        const response = await fetch(imageUri);
        const blob = await response.blob();

        // Create FormData and append the Blob to it
        const formData = new FormData();
        formData.append('file', blob, fileName);

        // Make a POST request to upload the image
        await axios.post('https://your-pocketbase-url/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Image uploaded successfully');
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}
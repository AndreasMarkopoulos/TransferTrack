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

export const chartNoDataPlugin = {
    id: 'emptyChart',
    afterDraw(chart: any) {
        const { datasets } = chart.data;
        let hasData = false;

        for (let dataset of datasets) {
            //set this condition according to your needs
            if (dataset.data.length > 0 && (dataset.data as any[]).some(item => item !== 0)) {
                hasData = true;
                break;
            }
        }

        if (!hasData) {
            //type of ctx is CanvasRenderingContext2D
            //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
            //modify it to your liking
            const { chartArea: { left, top, right, bottom }, ctx } = chart;
            const centerX = (left + right) / 2;
            const centerY = (top + bottom) / 2;

            chart.clear();
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = "#CAC4D0";
            ctx.fillText('No trips for selected date', centerX, centerY);
            ctx.restore();
        }
    }
};
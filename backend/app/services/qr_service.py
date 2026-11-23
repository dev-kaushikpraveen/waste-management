import qrcode
import io
import base64

class QRService:
    @staticmethod
    def generate_qr_data_uri(content: str) -> str:
        """
        Generates an authentic PNG QR code as a base64 Data URI
        """
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=10,
            border=2,
        )
        qr.add_data(content)
        qr.make(fit=True)

        img = qr.make_image(fill_color="#166534", back_color="#FFFFFF")
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{img_str}"

qr_service = QRService()

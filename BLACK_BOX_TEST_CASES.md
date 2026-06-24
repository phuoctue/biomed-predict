# Black-box Test Cases for MediAI

Copy this table into Word or Excel for your report.

## 1. Login

| ID | Mục tiêu | Dữ liệu test | Steps | Kết quả mong đợi |
|---|---|---|---|---|
| BB-LOGIN-01 | Đăng nhập thành công với dữ liệu hợp lệ | Email đúng, mật khẩu đúng | Mở trang login, nhập thông tin, bấm `Đăng nhập` | Hệ thống đăng nhập thành công và chuyển sang dashboard |
| BB-LOGIN-02 | Kiểm tra email sai định dạng | `abc` | Nhập email sai định dạng, bấm `Đăng nhập` | Hiện thông báo lỗi email không hợp lệ |
| BB-LOGIN-03 | Kiểm tra mật khẩu trống | Email hợp lệ, password rỗng | Để trống password và submit | Không cho đăng nhập hoặc hiện lỗi bắt buộc nhập |
| BB-LOGIN-04 | Kiểm tra sai mật khẩu | Email đúng, mật khẩu sai | Nhập thông tin và submit | Hiện thông báo đăng nhập thất bại |
| BB-LOGIN-05 | Kiểm tra tài khoản không tồn tại | Email không tồn tại | Nhập thông tin và submit | Hiện thông báo lỗi phù hợp từ hệ thống |
| BB-LOGIN-06 | Kiểm tra nút hiện mật khẩu | Bất kỳ | Bấm biểu tượng mắt | Mật khẩu chuyển giữa ẩn và hiện |
| BB-LOGIN-07 | Kiểm tra khi submit form trống | Email và password đều trống | Bấm `Đăng nhập` | Không login, hệ thống yêu cầu nhập dữ liệu |

## 2. Tìm kiếm thuốc

| ID | Mục tiêu | Dữ liệu test | Steps | Kết quả mong đợi |
|---|---|---|---|---|
| BB-DRUG-01 | Tìm thuốc với từ khóa hợp lệ | `para` | Nhập từ khóa vào ô tìm kiếm | Hiển thị danh sách thuốc phù hợp |
| BB-DRUG-02 | Kiểm tra từ khóa dưới 2 ký tự | `p` | Nhập 1 ký tự | Không gọi tìm kiếm hoặc không hiện gợi ý |
| BB-DRUG-03 | Chọn thuốc từ danh sách gợi ý | Thuốc tìm được như `Paracetamol` | Click vào thuốc gợi ý | Thuốc được thêm vào danh sách đã chọn |
| BB-DRUG-04 | Không tìm thấy thuốc | Từ khóa không tồn tại | Nhập và chờ kết quả | Hiển thị thông báo không tìm thấy thuốc phù hợp |
| BB-DRUG-05 | Xóa thuốc đã chọn | Thuốc đã được thêm | Bấm nút xóa trên thẻ thuốc | Thuốc được xóa khỏi danh sách |
| BB-DRUG-06 | Tìm kiếm nhiều lần | Nhiều từ khóa khác nhau | Đổi từ khóa liên tục | Hệ thống cập nhật kết quả đúng theo từ khóa mới |

## 3. Đánh giá thuốc bằng AI

| ID | Mục tiêu | Dữ liệu test | Steps | Kết quả mong đợi |
|---|---|---|---|---|
| BB-AI-01 | Đánh giá thành công khi đủ dữ liệu | Chọn bệnh nhân + thuốc | Chọn bệnh nhân, chọn thuốc, bấm `Lưu vào hồ sơ` | Hệ thống trả kết quả AI và hiển thị trên màn hình |
| BB-AI-02 | Thiếu bệnh nhân | Chỉ chọn thuốc | Bấm `Lưu vào hồ sơ` | Hiện thông báo yêu cầu chọn bệnh nhân |
| BB-AI-03 | Thiếu thuốc | Chỉ chọn bệnh nhân | Bấm `Lưu vào hồ sơ` | Hiện thông báo yêu cầu chọn ít nhất một thuốc |
| BB-AI-04 | AI trả về mức rủi ro thấp | Kết quả `low` | Thực hiện đánh giá | Hiện thông báo an toàn, không có cảnh báo cao |
| BB-AI-05 | AI trả về mức rủi ro cao | Kết quả `high` | Thực hiện đánh giá | Hiện cảnh báo rủi ro cao và khuyến nghị xử lý |
| BB-AI-06 | AI trả về lỗi | Backend lỗi | Thực hiện đánh giá | Hiện thông báo thất bại hoặc không thể thực hiện đánh giá |
| BB-AI-07 | Kiểm tra trạng thái đang xử lý | Gửi yêu cầu đánh giá | Bấm nút đánh giá | Hiện loading/progress trong lúc chờ |

// =====================================================
// Fortune Booking Website
// JavaScript
// =====================================================


// =====================================================
// Booking Form
// =====================================================

// =====================================================
// Booking Form
// =====================================================

const bookingForm = document.getElementById("booking-form");

if (bookingForm) {

    bookingForm.addEventListener("submit", async function(event) {

        event.preventDefault();


        // =====================================================
        // รับข้อมูลจากแบบฟอร์ม
        // =====================================================

        const name =
            document.getElementById("customer-name").value.trim();

        const contact =
            document.getElementById("contact").value.trim();

        const date =
            document.getElementById("booking-date").value;

        const timeInput =
            document.getElementById("booking-time");

        const question =
            document.getElementById("question").value.trim();


        // =====================================================
        // ตรวจสอบข้อมูล
        // =====================================================

        if (!name || !contact || !date || !timeInput.value) {

            alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");

            return;

        }


        // =====================================================
        // อ่านข้อมูลจากเวลาที่เลือก
        // =====================================================

        const selectedOption =
            timeInput.options[timeInput.selectedIndex];


        if (!selectedOption || !selectedOption.dataset.service) {

            alert("กรุณาเลือกเวลาที่ต้องการจอง");

            return;

        }


        const service =
            selectedOption.dataset.service;

        const price =
            selectedOption.dataset.price;

        const startTime =
            selectedOption.value;

        const endTime =
            selectedOption.dataset.endTime;


        // =====================================================
        // ข้อมูลที่จะส่งไป Google Sheets
        // =====================================================

        const data = {

    // =====================================================
    // ข้อมูลการจอง
    // =====================================================

    name: name,

    contact: contact,

    date: date,

    startTime: startTime,

    endTime: endTime,

    service: service,

    price: price,

    question: question,


    // =====================================================
    // ข้อมูลวันเกิด
    // =====================================================

    birthDay:
        document.getElementById("birth-day")?.value || "",

    birthMonth:
        document.getElementById("birth-month")?.value || "",

    birthYear:
        document.getElementById("birth-year")?.value || "",

    birthTime:
        document.getElementById("birth-time")?.value || "",

    birthPlace:
        document.getElementById("birth-place")?.value || "",

    unknownBirthTime:
        document.getElementById("unknown-birth-time")?.checked || false

};


        console.log("ข้อมูลที่จะส่ง:", data);


        // =====================================================
        // ส่งข้อมูลไป Apps Script
        // =====================================================

        try {

            const response = await fetch(WEB_APP_URL, {

                method: "POST",

                body: JSON.stringify(data)

            });


            if (!response.ok) {

                throw new Error(
                    "ไม่สามารถเชื่อมต่อระบบจองคิวได้"
                );

            }


            const result =
                await response.json();


            console.log(
                "ผลจาก Apps Script:",
                result
            );


            // =====================================================
            // จองสำเร็จ
            // =====================================================

            if (result.success) {

                alert(
                    "ส่งคำขอจองคิวเรียบร้อยแล้วครับ\n\n" +

                    "วันที่: " +
                    date +
                    "\n" +

                    "เวลา: " +
                    startTime +
                    " - " +
                    endTime +
                    "\n" +

                    "บริการ: " +
                    service +
                    "\n" +

                    "ราคา: " +
                    price +
                    " บาท"
                );


                // ล้างแบบฟอร์ม

                bookingForm.reset();


                // ล้างรายการเวลา

                timeInput.innerHTML = "";

                const option =
                    document.createElement("option");

                option.value = "";

                option.textContent =
                    "-- กรุณาเลือกเวลา --";

                timeInput.appendChild(option);


            } else {

                alert(
                    "ไม่สามารถจองคิวได้\n\n" +

                    (
                        result.message ||
                        "กรุณาลองใหม่อีกครั้ง"
                    )
                );

            }


        } catch (error) {

            console.error(
                "Booking Error:",
                error
            );


            alert(
                "เกิดข้อผิดพลาดในการเชื่อมต่อ\n" +
                "กรุณาลองใหม่อีกครั้งครับ"
            );

        }

    });

}

        // =====================================================
// แสดงข้อมูลเกิดเฉพาะบริการโหราศาสตร์ไทย
// =====================================================


// =====================================================
// สร้างรายการวันเกิด 1 - 31
// =====================================================

const birthDay = document.getElementById("birth-day");

if (birthDay) {

    for (let day = 1; day <= 31; day++) {

        const option = document.createElement("option");

        option.value = day;

        option.textContent = day;

        birthDay.appendChild(option);

    }

}// =====================================================
// ไม่ทราบเวลาเกิด
// =====================================================

const birthTime = document.getElementById("birth-time");
const unknownBirthTime = document.getElementById("unknown-birth-time");

if (birthTime && unknownBirthTime) {

    unknownBirthTime.addEventListener("change", function () {

        if (this.checked) {

            birthTime.value = "";
            birthTime.disabled = true;

        } else {

            birthTime.disabled = false;

        }

    });

}// =====================================================
// ดึงคิวจาก Google Sheets / Apps Script
// =====================================================

const WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbzgShePy3ymZRP01zp07WtZkBY6OlHPuebkFFH_EWHPtAnfCPBvGp8OOd6GO-LDrEz3/exec";

let availableSlots = [];


// =====================================================
// โหลดคิวที่เปิด
// =====================================================

async function loadAvailableSlots() {

    try {

        const response = await fetch(WEB_APP_URL);

        if (!response.ok) {
            throw new Error("ไม่สามารถเชื่อมต่อระบบคิวได้");
        }

        availableSlots = await response.json();

        console.log("คิวที่เปิด:", availableSlots);

        setupBookingSlots();

    } catch (error) {

        console.error("เกิดข้อผิดพลาด:", error);

        alert("ไม่สามารถโหลดคิวได้ กรุณาลองใหม่อีกครั้ง");

    }

}


// =====================================================
// ตั้งค่าการเลือกวันและเวลา
// =====================================================

// =====================================================
// ตั้งค่าการเลือกวันและเวลา
// =====================================================

// =====================================================
// แสดงคิวล่วงหน้า 14 วัน
// =====================================================

function setupBookingSlots() {

    const dateInput =
        document.getElementById("booking-date");

    const timeInput =
        document.getElementById("booking-time");

    const birthInfo =
        document.getElementById("birth-info");

    const calendar =
        document.getElementById("booking-calendar");


    if (!dateInput || !timeInput || !calendar) {
        console.error("ไม่พบ booking-date / booking-time / booking-calendar");
        return;
    }


    // =====================================================
    // ฟังก์ชันแปลงวันที่
    // =====================================================

    function formatDateForSlot(date) {

        const day =
            String(date.getDate()).padStart(2, "0");

        const month =
            String(date.getMonth() + 1).padStart(2, "0");

        const year =
            date.getFullYear();

        return day + "/" + month + "/" + year;
    }


    // =====================================================
    // ฟังก์ชันแสดงวันที่ภาษาไทย
    // =====================================================

    function getThaiDateText(date) {

        const days = [
            "อาทิตย์",
            "จันทร์",
            "อังคาร",
            "พุธ",
            "พฤหัสบดี",
            "ศุกร์",
            "เสาร์"
        ];

        const months = [
            "มกราคม",
            "กุมภาพันธ์",
            "มีนาคม",
            "เมษายน",
            "พฤษภาคม",
            "มิถุนายน",
            "กรกฎาคม",
            "สิงหาคม",
            "กันยายน",
            "ตุลาคม",
            "พฤศจิกายน",
            "ธันวาคม"
        ];

        return (
            "วัน" +
            days[date.getDay()] +
            " " +
            date.getDate() +
            " " +
            months[date.getMonth()] +
            " " +
            (date.getFullYear() + 543)
        );
    }


    // =====================================================
    // แสดงคิวของวันที่เลือก
    // =====================================================

    function selectBookingSlot(slot) {

        // ---------------------------------------------
        // แปลงวันที่ dd/mm/yyyy → yyyy-mm-dd
        // ---------------------------------------------

        const parts =
            slot.date.split("/");

        if (parts.length !== 3) {
            return;
        }

        const day = parts[0];
        const month = parts[1];
        const year = parts[2];


        dateInput.value =
            year + "-" +
            month + "-" +
            day;


        // ---------------------------------------------
        // สร้างรายการเวลาของวันนั้น
        // ---------------------------------------------

        timeInput.innerHTML = "";


        availableSlots
            .filter(function (item) {

                return item.date === slot.date;

            })
            .forEach(function (item) {

                const option =
                    document.createElement("option");

                option.value =
                    item.startTime;

                option.textContent =
                    item.startTime +
                    " - " +
                    item.endTime +
                    " | " +
                    item.service +
                    " — " +
                    item.price +
                    " บาท";


                option.dataset.service =
                    item.service;

                option.dataset.price =
                    item.price;

                option.dataset.endTime =
                    item.endTime;


                timeInput.appendChild(option);

            });


        // ---------------------------------------------
        // เลือกเวลาที่ลูกค้ากด
        // ---------------------------------------------

        timeInput.value =
            slot.startTime;


        // ---------------------------------------------
        // ตรวจสอบบริการ
        // ---------------------------------------------

        const selectedOption =
            timeInput.options[
                timeInput.selectedIndex
            ];


        if (selectedOption && birthInfo) {

            const service =
                selectedOption.dataset.service || "";


            if (
                service.includes("โหราศาสตร์ไทย")
            ) {

                birthInfo.style.display =
                    "block";

            } else {

                birthInfo.style.display =
                    "none";

            }

        }


        // ---------------------------------------------
        // แสดงว่าคิวไหนถูกเลือก
        // ---------------------------------------------

        document
            .querySelectorAll(".booking-slot")
            .forEach(function (element) {

                element.classList.remove("selected");

            });


        if (slot.element) {

            slot.element.classList.add(
                "selected"
            );

        }


        console.log(
            "เลือกคิว:",
            slot
        );

    }


    // =====================================================
    // สร้างปฏิทิน 14 วัน
    // =====================================================

    calendar.innerHTML = "";


    const today =
        new Date();


    for (let i = 0; i < 10; i++) {

        const currentDate =
            new Date(today);

        currentDate.setDate(
            today.getDate() + i
        );


        const formattedDate =
            formatDateForSlot(currentDate);


        // ---------------------------------------------
        // หาคิวของวันนี้
        // ---------------------------------------------

        const slotsForDate =
    availableSlots.filter(function (slot) {

        return (
            slot.date === formattedDate &&
            !slot.service.includes("ไพ่ทาโรต์ 1 คำถาม")
        );

    });


        // ---------------------------------------------
        // กล่องวันที่
        // ---------------------------------------------

        const dayBox =
            document.createElement("div");

        dayBox.className =
            "booking-day";


        // ---------------------------------------------
        // วันที่
        // ---------------------------------------------

        const dateTitle =
            document.createElement("div");

        dateTitle.className =
            "booking-day-title";

        dateTitle.textContent =
            getThaiDateText(currentDate);


        dayBox.appendChild(
            dateTitle
        );


        // ---------------------------------------------
        // ไม่มีคิว
        // ---------------------------------------------

        if (slotsForDate.length === 0) {

            const noSlot =
                document.createElement("div");

            noSlot.className =
                "no-booking-slot";

            noSlot.textContent =
                "ไม่มีคิวว่าง";

            dayBox.appendChild(
                noSlot
            );

        }


        // ---------------------------------------------
        // มีคิว
        // ---------------------------------------------

        slotsForDate.forEach(function (slot) {

            const slotButton =
                document.createElement("button");


            slotButton.type =
                "button";


            slotButton.className =
                "booking-slot";


            slotButton.innerHTML =
                "<strong>" +
                slot.startTime +
                " - " +
                slot.endTime +
                "</strong>" +
                "<span>" +
                slot.service +
                "</span>" +
                "<small>" +
                slot.price +
                " บาท" +
                "</small>";


            slot.element =
                slotButton;


            slotButton.addEventListener(
    "click",
    function () {

        // ==========================================
        // เมื่อกดคิวจากปฏิทิน
        // ให้เลือกวันที่และเวลาให้อัตโนมัติ
        // ==========================================

        // slot.date มีรูปแบบ dd/mm/yyyy
        // เช่น 16/08/2026

        const dateParts = slot.date.split("/");

        if (dateParts.length === 3) {

            const day = dateParts[0];
            const month = dateParts[1];
            const year = dateParts[2];

            // input type="date" ต้องใช้ yyyy-mm-dd
            dateInput.value =
                year + "-" +
                month + "-" +
                day;

        }

        // ==========================================
        // เลือกเวลาให้อัตโนมัติ
        // ==========================================

        timeInput.value = slot.startTime;

        // ให้ระบบทำงานเหมือนผู้ใช้เลือกเวลาเอง
        timeInput.dispatchEvent(
            new Event("change")
        );



// ==========================================
// ใช้ฟังก์ชันเดิมของระบบด้วย
// ==========================================

selectBookingSlot(slot);
// ==========================================
// ทำให้คิวที่เลือกมีสีค้าง
// ==========================================

document
    .querySelectorAll(".booking-slot.selected")
    .forEach(function (el) {
        el.classList.remove("selected");
    });

this.classList.add("selected");
    }
);


            dayBox.appendChild(
                slotButton
            );

        });


        calendar.appendChild(
            dayBox
        );

    }


    // =====================================================
    // ซ่อนช่องวันที่และเวลาเดิม
    // เพราะลูกค้าจะเลือกจากปฏิทิน 14 วัน
    // =====================================================

    dateInput.style.display =
        "none";

    timeInput.style.display =
        "none";


    // ซ่อน label ของวันที่และเวลา
    // เพื่อไม่ให้เหลือช่องว่าง

    const dateLabel =
        document.querySelector(
            'label[for="booking-date"]'
        );

    const timeLabel =
        document.querySelector(
            'label[for="booking-time"]'
        );


    if (dateLabel) {
        dateLabel.style.display =
            "none";
    }

    if (timeLabel) {
        timeLabel.style.display =
            "none";
    }


    // =====================================================
    // เริ่มต้นซ่อนข้อมูลวันเกิด
    // =====================================================

    if (birthInfo) {

        birthInfo.style.display =
            "none";

    }



    // =====================================================
// เมื่อเลือกวันที่
// =====================================================

dateInput.addEventListener("change", function () {

    const selectedDate =
        this.value;

    if (!selectedDate) {
        return;
    }


    // input type="date" จะเป็น yyyy-mm-dd
    // แปลงเป็น dd/mm/yyyy

    const parts =
        selectedDate.split("-");

    if (parts.length !== 3) {
        return;
    }


    const formattedDate =
        parts[2] + "/" +
        parts[1] + "/" +
        parts[0];


    // =================================================
    // ค้นหาคิวของวันที่เลือก
    // =================================================

    const slotsForDate =
        availableSlots.filter(function (slot) {

            return slot.date === formattedDate;

        });


    // =================================================
    // ล้างรายการเวลาเดิม
    // =================================================

    timeInput.innerHTML = "";


    // =================================================
    // ตัวเลือกเริ่มต้น
    // =================================================

    const firstOption =
        document.createElement("option");

    firstOption.value = "";

    firstOption.textContent =
        "-- กรุณาเลือกเวลา --";

    timeInput.appendChild(firstOption);


    // =================================================
    // ไม่มีคิว
    // =================================================

    if (slotsForDate.length === 0) {

        const option =
            document.createElement("option");

        option.value = "";

        option.textContent =
            "-- ไม่มีคิวในวันนี้ --";

        timeInput.appendChild(option);


        if (birthInfo) {
            birthInfo.style.display = "none";
        }

        return;
    }


    // =================================================
    // สร้างรายการเวลา
    // =================================================

    slotsForDate.forEach(function (slot) {

        const option =
            document.createElement("option");


        // เวลาเริ่ม
        option.value =
            slot.startTime;


        // ข้อความที่แสดง
        option.textContent =
            slot.startTime +
            " - " +
            slot.endTime +
            " | " +
            slot.service +
            " — " +
            slot.price +
            " บาท";


        // =================================================
        // เก็บข้อมูลของคิวไว้ใน option
        // =================================================

        option.dataset.service =
            slot.service;

        option.dataset.price =
            slot.price;

        option.dataset.endTime =
            slot.endTime;


        timeInput.appendChild(option);

    });


    // ซ่อนข้อมูลวันเกิดก่อนเลือกเวลา

    if (birthInfo) {
        birthInfo.style.display = "none";
    }

});


    // =====================================================
    // เมื่อเลือกเวลา
    // =====================================================

    timeInput.addEventListener("change", function () {

        const selectedOption =
            this.options[this.selectedIndex];


        if (!selectedOption) {
            return;
        }


        const selectedService =
            selectedOption.dataset.service || "";


        console.log(
            "บริการที่เลือก:",
            selectedService
        );


        // =================================================
        // แสดง / ซ่อนข้อมูลวันเกิด
        // =================================================

        if (birthInfo) {

            if (
                selectedService.includes("โหราศาสตร์ไทย")
            ) {

                birthInfo.style.display = "block";

                console.log(
                    "แสดงข้อมูลวันเดือนปีเกิด"
                );

            } else {

                birthInfo.style.display = "none";

            }

        }

    });


    // =====================================================
    // ถ้ามีวันที่เลือกอยู่แล้ว
    // ให้โหลดคิวทันที
    // =====================================================

    if (dateInput.value) {

        dateInput.dispatchEvent(
            new Event("change")
        );

    }

}
// =====================================================
// เริ่มโหลดคิวเมื่อเปิดหน้าเว็บ
// =====================================================

loadAvailableSlots();
// =====================================================
// สร้างปฏิทินคิวล่วงหน้า 14 วัน
// =====================================================

function renderBookingCalendar() {

    const calendar =
        document.getElementById("booking-calendar");

    if (!calendar) {
        console.error("ไม่พบ booking-calendar");
        return;
    }

    calendar.innerHTML = "";


    // =================================================
    // วันที่เริ่มต้น = วันนี้
    // =================================================

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    // =================================================
    // สร้าง 14 วัน
    // =================================================

    for (let i = 0; i < 14; i++) {

        const date = new Date(today);

        date.setDate(
            today.getDate() + i
        );


        // =================================================
        // แปลงเป็น dd/mm/yyyy
        // =================================================

        const day =
            String(date.getDate()).padStart(2, "0");

        const month =
            String(date.getMonth() + 1).padStart(2, "0");

        const year =
            date.getFullYear();

        const dateString =
            day + "/" + month + "/" + year;


        // =================================================
        // ชื่อวัน
        // =================================================

        const dayNames = [
            "อาทิตย์",
            "จันทร์",
            "อังคาร",
            "พุธ",
            "พฤหัสบดี",
            "ศุกร์",
            "เสาร์"
        ];

        const dayName =
            dayNames[date.getDay()];


        // =================================================
        // ค้นหาคิวของวันนี้
        // =================================================

        const slotsForDate =
            availableSlots.filter(function (slot) {

                return slot.date === dateString;

            });


        // =================================================
        // สร้างการ์ดวัน
        // =================================================

        const dayCard =
            document.createElement("div");

        dayCard.className =
            "calendar-day";


        if (slotsForDate.length > 0) {

            dayCard.classList.add("has-slot");

        } else {

            dayCard.classList.add("no-slot");

        }


        // =================================================
        // หัววันที่
        // =================================================

        const dateTitle =
            document.createElement("div");

        dateTitle.className =
            "calendar-date";

        dateTitle.textContent =
            dayName +
            " " +
            day +
            " " +
            getThaiMonth(
                date.getMonth()
            ) +
            " " +
            (year + 543);


        dayCard.appendChild(dateTitle);


        // =================================================
        // ไม่มีคิว
        // =================================================

        if (slotsForDate.length === 0) {

            const noSlot =
                document.createElement("div");

            noSlot.className =
                "no-slot-text";

            noSlot.textContent =
                "ไม่มีคิวว่าง";

            dayCard.appendChild(noSlot);

        }


        // =================================================
        // มีคิว
        // =================================================

        slotsForDate.forEach(function (slot) {

            const slotButton =
                document.createElement("button");

            slotButton.type =
                "button";

            slotButton.className =
                "calendar-slot";


            // เวลา

            const slotTime =
                document.createElement("span");

            slotTime.className =
                "slot-time";

            slotTime.textContent =
                slot.startTime +
                " - " +
                slot.endTime;


            // บริการ

            const slotService =
                document.createElement("span");

            slotService.className =
                "slot-service";

            slotService.textContent =
                slot.service;


            // ราคา

            const slotPrice =
                document.createElement("span");

            slotPrice.className =
                "slot-price";

            slotPrice.textContent =
                slot.price +
                " บาท";


            slotButton.appendChild(slotTime);
            slotButton.appendChild(slotService);
            slotButton.appendChild(slotPrice);


            // =================================================
            // เมื่อคลิกคิว
            // =================================================

            slotButton.addEventListener(
                "click",
                function () {

                    // ใส่วันที่ให้ input เดิม

                    if (dateInput) {

                        const yyyy =
                            String(year);

                        dateInput.value =
                            yyyy +
                            "-" +
                            month +
                            "-" +
                            day;

                        dateInput.dispatchEvent(
                            new Event("change")
                        );

                    }


                    // รอให้ระบบสร้างรายการเวลา
                    // แล้วเลือกเวลาที่กด

                    setTimeout(function () {

                        if (!timeInput) {
                            return;
                        }

                        for (
                            let j = 0;
                            j < timeInput.options.length;
                            j++
                        ) {

                            const option =
                                timeInput.options[j];


                            if (
                                option.value ===
                                slot.startTime
                            ) {

                                timeInput.selectedIndex =
                                    j;

                                timeInput.dispatchEvent(
                                    new Event("change")
                                );

                                break;

                            }

                        }

                    }, 50);


                    // เอาสี selected ออกจากทุกคิว

                    document
                        .querySelectorAll(
                            ".calendar-slot"
                        )
                        .forEach(function (item) {

                            item.classList.remove(
                                "selected"
                            );

                        });


                    // ทำคิวที่เลือกให้เด่น

                    slotButton.classList.add(
                        "selected"
                    );

                }
            );


            dayCard.appendChild(
                slotButton
            );

        });


        calendar.appendChild(
            dayCard
        );

    }

}


// =====================================================
// ชื่อเดือนภาษาไทย
// =====================================================

function getThaiMonth(monthIndex) {

    const months = [

        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม"

    ];

    return months[monthIndex];

}const serviceSelect = document.getElementById("service");

if (serviceSelect) {

    serviceSelect.addEventListener("change", function () {

        if (this.value) {
            this.classList.add("has-value");
        } else {
            this.classList.remove("has-value");
        }

    });
}
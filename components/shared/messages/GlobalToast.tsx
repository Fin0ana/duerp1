"use client"

import { Toast } from "primereact/toast"
import { toastRef } from "@/app/utils/toast";


function GlobalToast () {
    return <Toast ref={toastRef}></Toast>;
}

export default GlobalToast
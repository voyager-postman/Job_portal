import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { API_BASE_URL } from "../Url/Url";

const InvoiceView = () => {
  const { t } = useTranslation("global");
  const { id } = useParams();
  const invoiceRef = useRef();
  const [invoiceData, setInvoiceData] = useState(null);

  const fetchInvoice = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getInvoiceById/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setInvoiceData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  useEffect(() => {
    if (invoiceData) {
      setTimeout(downloadPDF, 800);
    }
  }, [invoiceData]);

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 3,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`invoice-${invoiceData?.invoiceNumber}.pdf`);
  };

  if (!invoiceData)
    return <div className="text-center p-5">{t("admin.loading_invoice")}</div>;

  const company = invoiceData.companyId;

  return (
    <section className="main-dashboard-content d-flex flex-column">
      <div className="invoice-container" ref={invoiceRef}>
        <div className="invoice-header d-flex justify-content-between">
          <div>
            <h2 className="invoice-title mb-2">{t("admin.invoice")}</h2>
            <span className="status-badge">
              {invoiceData.status || t("admin.validated")}
            </span>
          </div>
          <div className="text-end invoice-meta">
            <p>
              <strong>{t("admin.invoice_no")}</strong> {invoiceData.invoiceNumber}
            </p>
            <p>
              <strong>{t("admin.date")}</strong>{" "}
              {new Date(invoiceData.updatedAt).toLocaleString()}
            </p>
            <p>
              <strong>{t("admin.payment_method")}</strong>{" "}
              {invoiceData.paymentMethod || t("admin.pending")}
            </p>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-6">
            <h6 className="text-muted">{t("admin.billed_to")}</h6>
            <p className="mb-1 fw-bold">{company?.brandName}</p>
            <p className="mb-0">{invoiceData.paymentTransactionId?.stripe?.billingEmail || t("messaging.na")}</p>
            <p className="mb-0">{company?.companyAddress}</p>
            <p className="mb-0">
              +{company?.phone?.countryCode} {company?.phone?.number}
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <h6 className="text-muted">{t("admin.from")}</h6>
            <p className="mb-1 fw-bold">{t("admin.platform_name")}</p>
            <p className="mb-0">support@yourplatform.com</p>
          </div>
        </div>

        <div className="table-responsive mt-4">
          <table className="table invoice-table">
            <thead>
              <tr>
                <th>{t("admin.description")}</th>
                <th className="text-center">{t("admin.qty")}</th>
                <th className="text-end">{t("admin.unit_price")}</th>
                <th className="text-end">{t("admin.total")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{t("admin.credit_recharge")}</strong>
                  <div className="text-muted small">
                    {t("admin.job_credits")} {invoiceData.jobCredits ?? 0}
                    <br />
                    {t("admin.profile_credits")} {invoiceData.profileCredits ?? 0}
                    <br />
                    {t("admin.payment_method")} {invoiceData.paymentMethod || t("messaging.na")}
                    <br />
                    {t("admin.transaction_id")} {invoiceData.paymentTransactionId?._id || t("messaging.na")}
                  </div>
                </td>
                <td className="text-center">1</td>
                <td className="text-end">
                  {invoiceData.currency} {invoiceData.amount}
                </td>
                <td className="text-end">
                  {invoiceData.currency} {invoiceData.amount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="row justify-content-end mt-4">
          <div className="col-md-5">
            <div className="total-box">
              <div className="d-flex justify-content-between">
                <span>{t("admin.subtotal")}</span>
                <span>
                  {invoiceData.currency} {invoiceData.amount}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span>{t("admin.tax")}</span>
                <span>{invoiceData.currency} 0</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>{t("admin.total")}</span>
                <span>
                  {invoiceData.currency} {invoiceData.amount}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="invoice-footer text-center">{t("admin.invoice_footer")}</div>
      </div>
    </section>
  );
};

export default InvoiceView;

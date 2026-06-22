package com.mediai.ai.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.property.TextAlignment;
import com.mediai.ai.dto.AIEvaluationSummaryResponse;

@Service
public class ReportGenerationService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    public byte[] generatePdfReport(List<AIEvaluationSummaryResponse> evaluations, String title) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        try {
            PdfFont titleFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont headerFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont normalFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);

            // Title
            Paragraph titlePara = new Paragraph(title)
                    .setFont(titleFont)
                    .setFontSize(16)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(titlePara);

            // Generated date
            Paragraph datePara = new Paragraph("Generated: " + java.time.LocalDateTime.now().format(DATE_FORMATTER))
                    .setFont(normalFont)
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setMarginBottom(20);
            document.add(datePara);

            // Table
            float[] columnWidths = {2, 2, 1.5f, 1.5f, 1.5f, 2};
            Table table = new Table(columnWidths);

            // Header row
            addHeaderCell(table, "Patient Name", headerFont);
            addHeaderCell(table, "Drug Name", headerFont);
            addHeaderCell(table, "Score", headerFont);
            addHeaderCell(table, "Confidence", headerFont);
            addHeaderCell(table, "Risk Level", headerFont);
            addHeaderCell(table, "Date", headerFont);

            // Data rows
            for (AIEvaluationSummaryResponse eval : evaluations) {
                addDataCell(table, eval.patientName(), normalFont);
                addDataCell(table, eval.drugName(), normalFont);
                addDataCell(table, String.valueOf(eval.suitabilityScore()), normalFont);
                addDataCell(table, String.valueOf(eval.confidenceScore()), normalFont);
                addDataCell(table, eval.riskLevel(), normalFont);
                addDataCell(table, eval.createdAt().format(DATE_FORMATTER), normalFont);
            }

            document.add(table);

            document.close();
        } catch (Exception e) {
            throw new IOException("Failed to generate PDF report", e);
        }

        return outputStream.toByteArray();
    }

    public byte[] generateExcelReport(List<AIEvaluationSummaryResponse> evaluations, String title) throws IOException {
        XSSFWorkbook workbook = new XSSFWorkbook();
        var sheet = workbook.createSheet("Evaluations");

        try {
            // Set column widths
            sheet.setColumnWidth(0, 20 * 256);
            sheet.setColumnWidth(1, 20 * 256);
            sheet.setColumnWidth(2, 12 * 256);
            sheet.setColumnWidth(3, 12 * 256);
            sheet.setColumnWidth(4, 15 * 256);
            sheet.setColumnWidth(5, 20 * 256);

            // Title row
            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue(title);
            CellStyle titleStyle = workbook.createCellStyle();
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 14);
            titleStyle.setFont(titleFont);
            titleCell.setCellStyle(titleStyle);

            // Header row
            Row headerRow = sheet.createRow(2);
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            String[] headers = {"Patient Name", "Drug Name", "Suitability Score", "Confidence Score", "Risk Level", "Created At"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data rows
            int rowNum = 3;
            for (AIEvaluationSummaryResponse eval : evaluations) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(eval.patientName());
                row.createCell(1).setCellValue(eval.drugName());
                row.createCell(2).setCellValue(eval.suitabilityScore());
                row.createCell(3).setCellValue(eval.confidenceScore());
                row.createCell(4).setCellValue(eval.riskLevel());
                row.createCell(5).setCellValue(eval.createdAt().format(DATE_FORMATTER));
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        } finally {
            workbook.close();
        }
    }

    private void addHeaderCell(Table table, String content, PdfFont font) {
        var cell = new com.itextpdf.layout.element.Cell()
                .add(new Paragraph(content).setFont(font).setFontSize(11))
                .setBackgroundColor(com.itextpdf.kernel.colors.ColorConstants.LIGHT_GRAY);
        table.addCell(cell);
    }

    private void addDataCell(Table table, String content, PdfFont font) {
        var cell = new com.itextpdf.layout.element.Cell()
                .add(new Paragraph(content).setFont(font).setFontSize(10));
        table.addCell(cell);
    }
}

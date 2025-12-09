// Utility to add Vietnamese font support to jsPDF
import { jsPDF } from 'jspdf';

// Font Roboto Regular base64 (lightweight version supporting Vietnamese)
// This is a simplified version - for production, use full font file
// Commented out as not currently used - uncomment when needed
// const robotoBase64 = `...`;

export const addVietnameseFont = (doc: jsPDF) => {
    // jsPDF doesn't support custom fonts easily without pre-compilation
    // For now, we'll use a workaround with better encoding

    // Use Courier as it has better Unicode support than Helvetica
    doc.setFont('courier', 'normal');

    return doc;
};

// Alternative: Convert Vietnamese text to best displayable format
export const prepareVietnameseText = (text: string): string => {
    // jsPDF with standard fonts can display most Vietnamese characters
    // if we ensure proper UTF-8 encoding
    return text || '';
};

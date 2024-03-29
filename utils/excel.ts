import { axiosInstance } from "@/lib/axios-instance";
import { PostStudent, PostTestResult } from "@/schemas/record";
import { AxiosResponse } from "axios";
import Excel from "exceljs";

// exceljs indexing starts at 1
const EXCELJS_MARGIN = 1;

export const readFile = (file: File) => {
  return new Promise<FileReader["result"]>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const readExcel = async (file: File) => {
  const buffer = await readFile(file);
  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(buffer as ArrayBuffer);
  const worksheet = workbook.getWorksheet(1);
  return worksheet;
};

export const readResultExcel = async (
  file: File
): Promise<Omit<PostTestResult, "testId">[]> => {
  const ws = await readExcel(file);
  return ws
    .getSheetValues()
    .slice(EXCELJS_MARGIN + 1) // skip header
    .filter((row) => {
      if (!(row instanceof Array)) throw new Error("Invalid excel file");
      return row && row.filter(Boolean).length > 0;
    })
    .map((unknownRow) => {
      const row = unknownRow as string[];
      const [studentCode, score] = row.slice(EXCELJS_MARGIN).map(Number);
      return { studentCode, score };
    });
};

export const readStudentExcel = async (file: File): Promise<PostStudent[]> => {
  const ws = await readExcel(file);
  return ws
    .getSheetValues()
    .slice(EXCELJS_MARGIN + 1) // skip header
    .filter((row) => {
      if (!(row instanceof Array)) throw new Error("Invalid excel file");
      return row && row.filter(Boolean).length > 0;
    })
    .map((unknownRow) => {
      const row = unknownRow as string[];
      const [rawName, surname, citizenId, code, rawGrade, rawBranch] = row
        .slice(EXCELJS_MARGIN)
        .map(String);

      const name = surname ? `${rawName} ${surname}` : rawName;
      const [classGrade, classBranch] = /[-/]/.test(rawGrade)
        ? rawGrade.split(/[-/]/).map((s) => s.trim())
        : [rawGrade, rawBranch];

      return {
        name,
        citizenId,
        code: Number(code),
        classGrade: Number(classGrade),
        classBranch,
      };
    });
};

export const countSettledPromiseStatuses = <T extends AxiosResponse>(
  promises: PromiseSettledResult<T>[]
) => {
  const statuses = promises.map(
    (p) => p.status === "fulfilled" && p.value.status === 200
  );
  return {
    fulfilledCount: statuses.filter((s) => s).length,
    rejectedCount: statuses.filter((s) => !s).length,
    totalCount: statuses.length,
    errors: promises
      .filter((p) => p.status === "rejected" || p.value.status !== 200)
      .map((p) => (p.status === "rejected" ? p.reason : p.value.data)),
  };
};

export const postStudentExcel = async (file: File) => {
  const students = await readStudentExcel(file);
  console.log(students);
  const promises = students.map((student) =>
    axiosInstance.post("/api/excels/student", student)
  );
  const results = await Promise.allSettled(promises);
  return countSettledPromiseStatuses(results);
};

export const postResultExcel =
  (testId: number | null) => async (file: File) => {
    if (testId === null) throw new Error("Deneme ID'si boş bırakılamaz!");
    const testResults = await readResultExcel(file);
    const promises = testResults.map((testResult) =>
      axiosInstance.post("/api/excels/testResult", {
        ...testResult,
        testId,
      })
    );
    const promiseResults = await Promise.allSettled(promises);
    return countSettledPromiseStatuses(promiseResults);
  };

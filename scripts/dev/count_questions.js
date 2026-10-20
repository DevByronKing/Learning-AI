const fs = require('fs');

const content = fs.readFileSync('src/lib/mockData.ts', 'utf8');
const lines = content.split('\n');

let inExams = false;
let currentExamTitle = '';
let currentExamQuestions = 0;
let examsList = [];

lines.forEach((l) => {
  if (l.includes('export const MOCK_FULL_EXAMS:')) inExams = true;
  if (inExams && l.includes('export const INITIAL_MISTAKES:')) inExams = false;
  if (inExams) {
    if (l.includes('id:') && l.includes('sim-')) {
      if (currentExamTitle) {
        examsList.push({ title: currentExamTitle, count: currentExamQuestions });
      }
      currentExamQuestions = 0;
    }
    if (l.includes('title:') && !l.includes('targetExamTitle')) {
      const m = l.match(/title:\s*['"]([^'"]+)['"]/);
      if (m) currentExamTitle = m[1];
    }
    if (l.includes('statement:')) {
      currentExamQuestions++;
    }
  }
});
if (currentExamTitle) {
  examsList.push({ title: currentExamTitle, count: currentExamQuestions });
}

console.log('--- SIMULADOS COMPLETOS E CADERNOS OFICIAIS ---');
let totalExamQuestions = 0;
examsList.forEach((e, idx) => {
  console.log(`${idx + 1}. ${e.title} -> ${e.count} questões completas`);
  totalExamQuestions += e.count;
});
console.log('Total em Simulados Oficiais:', totalExamQuestions);

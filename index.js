const fs=require('fs');
const cheerio=require('cheerio');
const axios=require('axios');
const pageData=fs.readFileSync('data1.txt');
const { parse } = require('json2csv');
const ExcelJS = require('exceljs');
const $=cheerio.load(pageData.toString());
// console.log(cheerio);
const titlesArr=[];
const companyArr=[];
const loactionArr=[];
const postedArr=[];   
const postTypeArr=[];
const jobPostTypes=$('.JobDetail.JobTypeDetail.text-secondary');
jobPostTypes.each((isx,item)=>{
    const jobtype=$(item).text();
    postTypeArr.push(jobtype);
})
// console.log(postTypeArr);
const postedDates=$('.JobDetail.JobPostedOnDetail.text-secondary');
postedDates.each((idx,item)=>{
    const posted=$(item).text();
    postedArr.push(posted);
})
// console.log(postedArr);


const jobLoactions=$('.JobDetail.LocationDetail.text-secondary');
jobLoactions.each((idx,item)=>{
    const jobLocation=$(item).text();
loactionArr.push(jobLocation);
})
// console.log(loactionArr);


const companies=$('.JobDetail.CompanyDetail.text-secondary');
companies.each((idx,item)=>{
    const company=$(item).text();
    companyArr.push(company);
})
// console.log( companyArr);



const titles=$('.text-brand.f-bold.f16');
titles.each((idx,item)=>{
    const title=$(item).text();
    titlesArr.push(title.trim())
})

// console.log(titlesArr);

const completJobDetailsArr=titlesArr.map((item,idx)=>{
    return {
        "SR-NO":idx+1,
        "Job-Tittle":titlesArr[idx],
        "Job-location":loactionArr[idx],
        "Company":companyArr[idx],
        "Posted-Date":postedArr[idx],
        "Job-Type":postTypeArr[idx]
    }
})
console.log(completJobDetailsArr);

// Convert JSON data to CSV
const csv = parse(completJobDetailsArr);

// Create a new workbook and worksheet
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Sheet 1');

// Split CSV data into rows and add them to the worksheet
const rows = csv.split('\n');
rows.forEach((row, index) => {
  const cells = row.split(',');
  worksheet.addRow(cells);
});

const filePath = 'output.xlsx';
workbook.xlsx.writeFile(filePath)
  .then(() => {
    console.log(`Data has been written to ${filePath}`);
  })
  .catch(err => {
    console.error('Error writing to Excel file:', err);
  });



// const getData=async()=>{
//     try {
//         const response =await axios.get('https://www.workindia.in/jobs-in-pimpri-chinchwad-pune/');
//         const data=response.data;
//         fs.writeFileSync('data1.txt',data);
//         console.log(data);
//     } catch (error) {
//         console.log(error);
//     }
// }
// getData();
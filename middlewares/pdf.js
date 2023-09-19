const puppeteer = require('puppeteer');
const BASEURL= process.env.BASEURL

async function generatePDF(data) {
    try{
    const browser = await puppeteer.launch();
    console.log("two");
  
    // Create a new page
    const page = await browser.newPage();
  
    console.log("three");
    let date  = new Date(data.createdAt).toLocaleDateString();
    let htmlContent = `
    <html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- Title -->
    <title>Invoice</title> 
    <!-- Bootstrap Min CSS -->
   
   
</head> 
<body>
    <section>
        <div style="border:1px solid #000; box-sizing: border-box; padding: 10px; margin: 0 auto;"> 
            <h3 style="text-align:center"><strong>Tax Invoice</strong></h3>
            <div> 
                <div style="display: flex; justify-content: space-between;">
                    <div style="border: 1px solid #000;border-radius: 25px;width: 45%;padding: 10px;box-sizing: border-box;">
                        <h6 style="margin: 4px 0; font-size: 15px;">Customer Details</h6>
                        <p style="margin: 4px 0; font-size: 13px;"><span>Billing Name</span> <span>Krishna Prasad</span></p>
                        <div>
                            <strong>Address</strong>
                            <p style="margin: 4px 0; font-size: 13px;">Static Address</p>
                                </div>
                        <div style="display: flex;">
                            <div style="width: 50%; " >
                                <p style="margin: 4px 0; font-size: 13px;">State :<span >Delhi</span></p>
                                <p style="margin: 4px 0; font-size: 13px;">PAN No : <span >-</span></p>
                                <p style="margin: 4px 0; font-size: 13px;">TAN No : <span >-</span></p>
                                <p style="margin: 4px 0; font-size: 13px;">GST No : <span >-</span></p>
                            </div>
                             
                        </div>
                    </div>
                    <div style="border: 1px solid #000;border-radius: 25px;width: 45%;padding: 10px;box-sizing: border-box;">
                        <h6 style="margin: 4px 0; font-size: 15px;">Home Shifting Mart
                        </h6>
                        <table>
                            <tbody>
                                <tr>
                                    <td style="font-size: 14px; width: 200px;">Date :</td>
                                    <td style="font-size: 13px;">${date}</td>
                                </tr>
                                <tr>
                                    <td style="font-size: 14px;">Invoice No :</td>
                                    <td style="font-size: 13px;">${data.payment.orderId}</td>
                                </tr>
                                <tr>
                                    <td style="font-size: 14px;">PAN No :</td>
                                    <td style="font-size: 13px;">${process.env.COMPANYPAN}</td>
                                </tr>
                                <tr>
                                    <td style="font-size: 14px;">GST of company  :</td>
                                    <td style="font-size: 13px;">${process.env.COMPANYGST}</td>
                                </tr>
                                <tr>
                                    <td style="font-size: 14px;">HSM Billing Add. :</td>
                                    <td style="font-size: 13px;">${process.env.COMPANYADDERSS}</td>
                                </tr>
                                
                                
                            </tbody>
                        </table>                              
                         
                    </div>
                </div>
                <div style="border: 1px solid #000;border-radius: 25px;width: 100%;margin-top:10px;padding: 10px;box-sizing: border-box;">
                    <table style="width: 100%;">
                        <thead>
                            <tr style="text-align: left; background-color: #949191;">
                                <th style=" padding: 10px;">Being Amount paid for </th>
                                <th>Payment Details</th>
                                <th>Amount (Rs)</th>
                            </tr>
                        </thead>
                       <tbody>
                        <tr>
                            <td>${data.payment.productName}</td>
                            <td>Net Amount</td>
                            <td>${data.payment.amount}</td>
                        </tr>
                        <tr>
                            <td> </td>
                            <td>Total GST (18%)</td>
                            <td>${data.payment.amount * 0.18}</td>
                        </tr>
                        <tr >
                            <td> </td>
                            <td style="border-top: 1px solid #000; border-bottom: 1px solid #000;">Total Amount</td>
                            <td style="border-top: 1px solid #000; border-bottom: 1px solid #000;">${data.payment.paidAmount}</td>
                        </tr>
                        
                       </tbody>
                    </table>  
                </div>
                <table style="width: 100%; margin-top: 20px;">
                    <thead>
                        <tr style="text-align: left;">
                            <th>Relationship Manager</th>
                            <th>Sign</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Kundan Kumar pandey
                            </td>
                            <td> </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section> 
</body>

</html>
    `;
  
    // Set the content of the page
    await page.setContent(htmlContent);
    console.log("four");
    // Convert to PDF
    const pdf = await page.pdf({
        
      format: 'A4',
      path: `./invoice/${data.payment.orderId}.pdf`,
    });
    console.log("five");
    await browser.close();
  return BASEURL+ `/invoice/${data.payment.orderId}.pdf`;
}catch(err){
   return err.message;
}
  }

  module.exports = {
    generatePDF
  }


  
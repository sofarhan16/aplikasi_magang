import React, { Component } from 'react';
import '../../support/css-tambahan/footer.css'
class Footer extends Component{
    render(){
        return(
          <footer className="page-footer font-small primary-color font-templates">
            {/* Copyright */}
            <div className="container">
            <div className="row py-5">
              <div className="footer-copyright text-center pt-2 col-md-4 border-right">
                <img src="../images/logo.png" width="50px"/>
                <p className="text-white">PT. WHNESIA INTERNASIONAL NIAGA</p>
                <p>Temukan kami</p>
                <div className="text-center">
                    <a href={`https://www.instagram.com/warehousenesia.id/`} className='text-white pr-3'><i class='fab fa-instagram'></i></a>
                    <a href={`https://api.whatsapp.com/send?phone=6281977718191`} className='text-white pr-3'><i class="fab fa-whatsapp"></i></a>
                    <a href={`https://www.facebook.com/warehousenesia/`} className='text-white pr-3'><i class='fab fa-facebook-f'></i></a>
                    <a href={`https://twitter.com/Warehousenesiaa`} className='text-white pr-3'><i class='fab fa-twitter'></i></a>
                    <a href={`https://www.youtube.com/channel/UCXfya8I8rREXMor1tCf7Oag`} className='text-white pr-3'><i class='fab fa-youtube'></i></a>
                  </div>
              </div>
              <div className="footer-copyright text-center  pt-2 col-md-4 text-white border-right">© 2019 Copyright:
              <p className="text-white font-weight-bold">Information</p>
              <div className="container">
              <p className="text-white">Tentang kami</p>
              <a href="../document/tou.pdf" download="tou.pdf"><p className="text-white">Term Of Use</p></a>
              <a href="../document/FAQ_warehousenesia.docx" download="FAQ_warehousenesia.docx"><p className="text-white">FAQ</p></a>
              <a href="../document/privacy.pdf" download="privacy.pdf"><p className="text-white">Privacy Policy</p></a>
              <p className="text-white">Blog</p>
              <a href="https://www.linkedin.com/company/14559193/admin/"><p className="text-white">Career</p></a>
              </div>
                
              </div>
                <div className="footer-copyright text-left  pt-2 col-md-4 text-white">
                <div className="container">
                <p className="text-white font-weight-bold">Customer Care</p>
                <p className="text-secondary">Gedung Chevrolet Sandjungan lantai 3 , Room 3 & 4 Jalan Dewi Sartika No. 295, Cawang RT.9, RT.4/RW.4, Cawang, Kec. Kramat jati, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13630</p>
                <p className="text-secondary">Warehouse : Jl Tanjung 2 No 9 Depok</p>
                <p className="text-secondary">081295678931</p>
                <p className="text-primary">support@warehousenesia.id</p>
                </div>
                </div>
              </div>
              <a href="http://warehousenesia.id">2019 PT. WHNESIA INTERNASIONAL NIAGA All right reserved.</a>
            </div>
            {/* Copyright */}
        </footer>
        );
    }
}
export default Footer;
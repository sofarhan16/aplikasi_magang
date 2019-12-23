const conn = require('../database');
const transporter = require('../helpers/emailSender');
var fs = require('fs');
var { uploader } = require('../helpers/uploader');
var Crypto = require('crypto');
var biguint = require('biguint-format');
var moment = require('moment');

module.exports = { 

    addtocart: (req,res) => {
        var { id_customer,
            id_agent,
            id_produk,
            nama_produk,
            harga,
            berat,
            jumlah_beli,
            total_berat,
            total_harga,
            catatan} = req.body;

        var newBarang = { id_customer,
            id_agent,
            id_produk,
            nama_produk,
            harga,
            berat,
            jumlah_beli,
            total_berat,
            total_harga,
            catatan };
            var sql = `SELECT * FROM keranjang WHERE id_customer = '${id_customer}' and id_produk= '${id_produk}';`;
            conn.query(sql, (err, results) => {
                if(err) {
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                }
                // console.log(sql)
                // console.log(results.jumlah_beli)
                // console.log(results[0].jumlah_beli)
                if(results.length == 0) {
                    var sql2 = `INSERT INTO keranjang SET ? ;`;
                    conn.query(sql2, newBarang, (err, result) => {
                        if(err) throw err;
                        res.send(result);
                    })
                }else{
                    var new_jumlah_beli =results[0].jumlah_beli+Number(jumlah_beli);
                    var new_total_berat = results[0].total_berat + Number(total_berat);
                    var new_total_harga = results[0].total_harga + Number(total_harga);
                    var sql2 = `UPDATE keranjang SET jumlah_beli = ${new_jumlah_beli}, total_berat = ${new_total_berat}, total_harga = ${new_total_harga}
                    WHERE id_customer = '${id_customer}'  AND id_agent = '${id_agent}' AND id_produk = '${id_produk}';`;
                    conn.query(sql2, (err, result) => {
                        if(err) throw err;
                        res.send(result);
                    })
                }
            })
    },
    // =========================================================================================================================
    getlistcart: (req, res) => {
        var sql = `SELECT 
        k.id as id,
        k.id_agent as id_agent,
        k.id_produk as id_produk,
        k.id_customer as id_customer,
        c.nama_lengkap as nama_lengkap,
        p.nama_produk as nama_produk,
        p.id_kategori as kategori,
        p.gambar,
        k.bpom as bpom,
        k.harga as harga,
        k.berat as berat,
        k.jumlah_beli as jumlah_beli,
        k.total_berat as total_berat,
        k.total_harga as total_harga,
        k.catatan as catatan,
        n.negara as negara
        FROM keranjang k
        JOIN customers c on c.id_customer = k.id_customer
        JOIN produk p on p.id = k.id_produk
        JOIN negara n on p.id_negara = n.id
        JOIN users u on u.id = k.id_agent
        WHERE k.id_customer='${req.params.id}';`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
       
    }, 
    getlistchartagent: (req, res) => {
        var sql = `SELECT 
        k.id as id,
        k.id_agent as id_agent,
        k.id_produk as id_produk,
        k.id_customer as id_customer,
        c.nama_lengkap as nama_lengkap,
        c.npwp,
        c.provinsi,
        p.nama_produk as nama_produk,
        p.id_kategori as kategori,
        k.bpom as bpom,
        k.harga as harga,
        k.berat as berat,
        k.jumlah_beli as jumlah_beli,
        k.total_berat as total_berat,
        k.total_harga as total_harga,
        n.negara as negara,
        n.id as id_negara,
        k.catatan as catatan
        FROM keranjang k
        JOIN customers c on c.id_customer = k.id_customer
        JOIN produk p on p.id = k.id_produk
        JOIN negara n on p.id_negara = n.id
        JOIN users u on u.id = k.id_agent
        WHERE u.username='${req.params.username}';`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
       
    },
    
    getlistcartall: (req, res) => {
        var sql = `SELECT distinct
        k.id_customer as id_customer,
        c.nama_lengkap as nama_lengkap,
        c.provinsi,
        (select sum(jumlah_beli) from keranjang where id_customer =k.id_customer) as jumlah_beli,
        (select sum(total_berat) from keranjang where id_customer =k.id_customer) as total_berat,
        (select sum(total_harga) from keranjang where id_customer =k.id_customer) as total_harga,
        n.negara as negara
        FROM keranjang k
        inner JOIN customers c on c.id_customer = k.id_customer
        JOIN produk p on p.id = k.id_produk
        JOIN negara n on p.id_negara = n.id
        JOIN users u on u.id = k.id_agent
        WHERE u.username='${req.params.username}';`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
       
    },
    getlistorderdetail: (req, res) => {
        var sql = `select
        t.id_transaksi,
        c.id_customer,
        c.nama_lengkap,
        dt.jumlah_beli,
        p.berat*dt.jumlah_beli as berat,
        n.negara,
        p.harga*dt.jumlah_beli as harga
        from transaksi t
        join users u on u.id = t.id_agent
        join detail_transaksi dt on dt.id_transaksi = t.id_transaksi
        join produk p on p.id = dt.id_produk
        join negara n on p.id_negara = n.id
        join customers c on c.id_customer = dt.id_customer 
        where t.id_transaksi =${req.params.id_transaksi};`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
       
    },
    getreportorder: (req, res) => {
        var sql = `select *
        from transaksi 
        where id_transaksi =${req.params.id_transaksi};`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
       
    },
    getlistordercustomerdetail: (req, res) => {
        var {id_customer,id_transaksi} = req.body;
        var sql = `SELECT 
        k.id as id,
        k.id_produk as id_produk,
        k.id_customer as id_customer,
        c.nama_lengkap as nama_lengkap,
        p.nama_produk as nama_produk,
        k.harga as harga,
        p.berat as berat,
        k.jumlah_beli as jumlah_beli,
        p.berat*k.jumlah_beli as total_berat,
        k.total_harga as total_harga,
        n.negara as negara,
        k.catatan as catatan
        FROM detail_transaksi k
        JOIN customers c on c.id_customer = k.id_customer
        JOIN produk p on p.id = k.id_produk
        JOIN negara n on p.id_negara = n.id
        WHERE k.id_customer=${id_customer} and k.id_transaksi = ${id_transaksi};`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
       
    }, 
    // =========================================================================================================================
    editcatatancustomer: (req, res) => {
        var {  id,catatan} = req.body;
        
        var sql = `UPDATE keranjang SET catatan="${catatan}" WHERE id =${id}  ;`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        })
       
    },
    // =========================================================================================================================
    editlistcart: (req, res) => {
        var { id_customer,
            id_agent,
            id_produk,
            jumlah_beli,
            total_berat,
            total_harga} = req.body;
        
        var sql = `UPDATE keranjang SET jumlah_beli = ${jumlah_beli}, total_berat = ${total_berat}, total_harga = ${total_harga}
                    WHERE id_customer = '${id_customer}'  AND id_agent = '${id_agent}' AND id_produk = '${id_produk}';`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
       
    },
    // =========================================================================================================================
     deleteitemcart: (req,res) => {
        var { id_agent, id_customer, id_produk } = req.body;
       
        var sql = `DELETE FROM keranjang WHERE id_customer = '${id_customer}' AND id_agent = '${id_agent}' AND id_produk = '${id_produk}';`;
        
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
        
    },
    // =========================================================================================================================
    addtransaction: (req, res) => {
        var { id_agent, total_bayar, total_berat, total_beli, transactionfee, hargashipping, email } = req.body;
        console.log(id_agent,'fikar')
        var sql = `INSERT INTO transaksi SET ?;`;
        var dates = new Date();
        var result = new Date(new Date(dates).setDate(new Date(dates).getDate() + 2));
        var sec   = dates.getSeconds()
        
        randomi = (qty) => {
            return Crypto.randomBytes(qty)
        }

        var makeit = biguint(randomi(7), 'dec').slice(0, 3)
        
        var new_ids = String(id_agent)+String(total_beli)+String(total_bayar)+makeit;
        console.log(new_ids)
        var newTransaction = {
            id_transaksi: new_ids,
            id_agent,
            waktu: moment(new Date()).format('YYYY-MM-MM HH:mm:ss'),
            total_bayar, 
            total_berat,
            total_beli, 
            transactionfee,
            hargashipping,
            tenggang_waktu: result,
            is_finished: "no"
        }
        conn.query(sql, newTransaction, (err, result) => {
            if(err){ throw err

            }else{
                console.log(sql);
                console.log(result.insertId)
                console.log(result)
                console.log('Success!')
                //res.send({username, email, role: 'User', status: 'Unverified', token:''})
                res.send({result, newId: new_ids});
            }
            

            

            // var mailOptions = {
            //     from: 'warehousenesia <warehousenesiaindo@gmail.com>',
            //     to : email,
            //     subject : 'Payment Order',
            //     html: `<h3>Terimakasih Sudah Berbelanja!</h3>
            //             <p>Silahkan lakukan pembayaran untuk melanjutkan proses pemesanan yang sudah
            //             anda lakukan, sebagai berikut: </p>
            //             <p>Total Pembayaran: Rp. ${total_bayar.toLocaleString()}</p>
            //             <h4>Setelah melakukan transfer, harap <b>upload bukti pembayaran</b> di Halaman :</h4> 
            //             <a href="http://warehousenesia.id/agent/confirmpayment">Konfirmasi Pembayaran</a>`
            // }

            // transporter.sendMail(mailOptions, (err2, res2) => {
            //     if(err2){
            //         console.log(err2);
            //         // res.send({status: 'Error!', message: 'Error sending message'})
            //         throw res2;
            //     } else {
            //         console.log('Success!')
            //         // res.send({username, email, role: 'User', status: 'Unverified', token:''})
            //         res.send(result);
            //     }
            // })
            //res.send(result);
        })
      
    },
    // =========================================================================================================================
    adddetailtransaction: (req, res) => {
        
        var { id_transaksi, id_customer, id_produk, nama_produk, harga, jumlah_beli, total_harga, catatan,bpom, id_agent, id_kategori, id_negara, waktu, berat, tot_berat } = req.body;

        var newDetail = {
            id_transaksi,
            id_customer,
            id_produk,
            nama_produk,
            harga,
            jumlah_beli,
            total_harga,
            catatan,
            bpom
        }

        var manifest = {
            id_agent,
            id_negara,
            id_kategori,
            id_produk,
            id_customer,
            id_transaksi,
            waktu: new Date(),
        }

         

        var sdata = {
            nama_produk,
            harga,
            jumlah: jumlah_beli,
            total_harga,
            id_produk,
            id_transaksi,
            id_customer,
            waktu: waktu,
            berat: berat,
            total_berat: tot_berat,
            catatan

        }   

        var sql = `INSERT INTO detail_transaksi SET ?;`;
        var sqlf = `INSERT INTO manifest SET ?;`;
        var sqls = `INSERT INTO superdata SET ?`;
        conn.query(sql, newDetail, (err, result) => {
            if(err) throw err;
            // console.log(sql);
            // console.log(result);
            var {insertID} = result.insertId
            console.log(`ini insert id`+insertID)
            conn.query(sqlf, manifest, (err, result2) => {
                if(err) throw err;
                
                conn.query(sqls, sdata, (err, result3) => {
                    if(err) throw err;
                })

            })
            res.send(result);
        })

        
    },
    // =========================================================================================================================

    getInvoice: (req, res) => {
        
        var sql =  `SELECT
        n.negara as negara,
        n.id as id_negara,
        c.id_customer as customer_id,
        c.nama_lengkap,
        c.number as contact_person,
        c.alamat as address,
        c.kota as city,
        c.provinsi as state,
        c.kodepos as postcode,
        u.username,
        u.id as id_agent,
        t.id_transaksi as id_transaksi,
        t.waktu as waktu, 
        t.total_berat,
        p.id as id_produk,
        dt.jumlah_beli ,
        p.nama_produk,
        p.berat as berat,
        p.harga as harga,
        dt.catatan as catatan,
        dt.id as id_manifest,
        dt.bpom as bpom
        FROM detail_transaksi dt 
        join customers c on c.id_customer=  dt.id_customer
        join produk p on p.id = dt.id_produk
        join negara n on p.id_negara = n.id
        join transaksi t on t.id_transaksi = dt.id_transaksi
        join users u on u.id= t.id_agent        
        where t.id_transaksi = ${req.params.id_transaksi};`
        conn.query(sql, (err, result) => {
            res.send(result)
        })

    },

    // =========================================================================================================================
    clearcart: (req, res) => {
       
        var sql = `DELETE FROM keranjang WHERE id_agent = ${req.body.id_agent};`;

        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
       
    },
    getlistorder: (req, res) => {
        var sql = `select 
        t.id_transaksi,
        t.total_berat, 
        t.total_bayar,
        t.waktu,
        t.is_finished
        from transaksi t
        JOIN users u on u.id = t.id_agent
        where u.username = '${req.params.username}';`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
       
    },
    // =========================================================================================================================
    // countcart: (req, res) => {
        
    //     var sql = `SELECT COUNT(*) AS count FROM keranjang WHERE username='${req.body.username}';`;
    //     conn.query(sql, (err, result) => {
    //         if(err) throw err;
    //         console.log(sql);
    //         console.log(result[0].count)
    //         res.send(result[0]);
    //     })
        
    // },

    getAllPayment:() => {

    },

    autoDelete:(req, res) => {

        var { id_transaksi} = req.body;
       
        var sql = `DELETE FROM transaksi WHERE id_transaksi = '${id_transaksi}';`;
        
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })

    },

    confirmpayment: (req,res) => {
        try {
            const path = '/images/transaction'; //file save path
            const upload = uploader(path, 'PAY').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
    
                const { image } = req.files;
                console.log(image)
                const imagePath = image ? path + '/' + image[0].filename : null;
                console.log(imagePath)
    
                console.log(req.body.data)
                req.body.data.waktu = moment(new Date()).format('YYYY-MM-MM HH:mm:ss');
                const data = JSON.parse(req.body.data);
                console.log(data)
                data.image = imagePath;          
                      
               
                var sql = 'INSERT INTO payment SET ?';
                conn.query(sql, data, (err, results) => {
                    console.log(data)
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                   
                    console.log(results);
                    sql = 'SELECT * from payment;';
                    conn.query(sql, (err, results) => {
                        if(err) {
                            console.log(err.message);
                            //return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                            res.send(result);
                        }
                        console.log(results);
                        
                        var sql = `UPDATE transaksi SET is_finished = 'Pembayaran sedang diproses' WHERE id_transaksi = ${data.id_transaksi};`;
                        conn.query(sql, (err, hasil) => {
                            if(err) throw err;
                            console.log(sql);
                            console.log(hasil)
                            
                        })
                        res.send(results);
                    })
                      
                })    
            })
        } catch(err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
    },
    // // untuk user - di halaman konfirmasi pembayaran / upload bukti
    getlistpayment: (req, res) => {
       
        var sql = `SELECT * FROM transaksi t
        join users u on t.id_agent = u.id
        where u.username = '${req.body.username}'
        and t.is_finished = 'no'
        ORDER BY t.waktu;`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
        
    }, 
    // gethistorytrx: (req,res) => {
       
    //     var sql = `SELECT * FROM transaksi WHERE username='${req.body.username}' AND is_finished='yes';`;

    //     conn.query(sql, (err, result) => {
    //         if(err) throw err;
    //         console.log(sql);
    //         console.log(result)
    //         res.send(result);
    //     })
        
    // },
    // gethistorydetail: (req,res) => {
        
    //     var sql = `SELECT DT.id_transaksi, DT.username, DT.isbn, DT.judul, DT.harga, DT.jumlah_beli, DT.total_harga, B.gambar 
    //                 FROM detil_transaksi DT
    //                 JOIN buku B
    //                 ON DT.isbn = B.isbn
    //                 WHERE DT.id_transaksi = ${req.body.id_transaksi};`;
    //     conn.query(sql, (err, result) => {
    //         if(err) throw err;
    //         console.log(sql);
    //         console.log(result)
    //         res.send(result);
    //     })
        
    // },

    // // ====================== ADMIN =======================================

    // // untuk admin: get list -> Data order untuk diverifikasi

    allPaymentOrder: (req, res) => {
        var sql = `SELECT * FROM payment ORDER BY waktu DESC`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
    },

    getlisttoverify: (req, res) => {
        
        var sql = `SELECT 
        TR.id_transaksi,u.username, TR.waktu AS waktu_transaksi, TR.total_bayar, TR.total_berat, TR.is_finished, 
        PY.waktu AS waktu_konfirmasi, PY.image
        FROM transaksi TR
        LEFT JOIN  payment PY
        ON PY.id_transaksi = TR.id_transaksi
        join users u on u.id = TR.id_agent
        WHERE PY.image IS NOT NULL 
        AND TR.is_finished = 'Pembayaran sedang diproses'
        ORDER BY waktu_konfirmasi`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
        
    },
    getdataorder: (req, res) => {
        
        var sql = `SELECT 
        TR.id_transaksi,u.username, TR.waktu AS waktu_transaksi, TR.total_bayar, TR.total_berat, TR.is_finished
        FROM transaksi TR
        join users u on u.id = TR.id_agent
        WHERE TR.is_finished != 'Pesanan selesai' and TR.is_finished != 'no'
        ORDER BY waktu_transaksi`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
        
    },

    getHistoryMonth: () => {

        var sql = `SELECT * FROM `

    },

    getdataorderhistory: (req, res) => {
        
        var sql = `SELECT 
        TR.id_transaksi,u.username, TR.waktu AS waktu_transaksi, TR.total_bayar, TR.total_berat, TR.is_finished
        FROM transaksi TR
        join users u on u.id = TR.id_agent
        WHERE TR.is_finished = 'Pesanan selesai'
        ORDER BY waktu_transaksi DESC`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
        
    },


    getdataRegisterTotal: (req, res) => {
        
        var sql = `SELECT da.total FROM daftar_agent da
        LEFT JOIN users u on u.id = da.id_agent
        WHERE u.status = "Verified"`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
        
    },

    // // approve payment dari buyer
    approvepayment: (req, res) => {
        
        var sql = `UPDATE transaksi SET is_finished = 'Pesanan diproses' WHERE id_transaksi = ${req.body.id_transaksi};`;
        var sqls = `UPDATE superdata SET status = 1 WHERE id_transaksi = ${req.body.id_transaksi};`;
        
        conn.query(sql, (err, result) => {
            if(err) throw err;
                conn.query(sqls, (err, result) => {
                    if(err) throw err;


                })
            res.send(result);
        })
        
    },
    getlistordercustomer: (req, res) => {
        var sql = `SELECT
        n.negara as negara_asal,
        n.id as id_negara,
        c.id_customer as customer_id,
        c.nama_lengkap as nama_customer,
        c.number as contact_person,
        c.alamat as address,
        c.kota as city,
        c.provinsi as state,
        c.kodepos as postcode,
        u.username as agent_name,
        u.id as id_agent,
        t.id_transaksi as id_transaksi,
        t.waktu as waktu, 
        p.id as id_produk,
        dt.jumlah_beli as no_of_pieces,
        p.nama_produk as item_description,
        p.id as id,
        p.gambar as gambar,
        p.berat as weight,
        p.harga as price,
        dt.catatan as catatan,
        dt.id as id_manifest,
        dt.bpom as bpom
        FROM detail_transaksi dt 
        join customers c on c.id_customer=  dt.id_customer
        join produk p on p.id = dt.id_produk
        join negara n on p.id_negara = n.id
        join transaksi t on t.id_transaksi = dt.id_transaksi
        join users u on u.id= t.id_agent        
        where t.id_transaksi = ${req.params.id_transaksi};`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
       
    },
    getlistordercustomerthismonth: (req, res) => {
        var sql = `SELECT
        n.negara as negara_asal,
        n.id as id_negara,
        c.id_customer as customer_id,
        c.nama_lengkap as nama_customer,
        c.number as contact_person,
        c.alamat as address,
        c.kota as city,
        c.provinsi as state,
        c.kodepos as postcode,
        u.username as agent_name,
        u.id as id_agent,
        t.id_transaksi as id_transaksi,
        t.waktu as waktu, 
        p.id as id_produk,
        dt.jumlah_beli as no_of_pieces,
        p.nama_produk as item_description,
        p.id as id,
        p.gambar as gambar,
        p.berat as weight,
        p.harga as price
        FROM detail_transaksi dt 
        join customers c on c.id_customer=  dt.id_customer
        join produk p on p.id = dt.id_produk
        join negara n on p.id_negara = n.id
        join transaksi t on t.id_transaksi = dt.id_transaksi
        join users u on u.id= t.id_agent        
        where month(t.waktu)= ${req.body.month} and year(t.waktu)=${req.body.year};`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
       
    },sendstatus: (req, res) => {
        
        var sql = `UPDATE transaksi SET is_finished = '${req.body.is_finished}',waktu='${req.body.waktu}' WHERE id_transaksi = ${req.body.id_transaksi};`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
        
    },
    sendstatus2: (req, res) => {
        
        var sql = `UPDATE transaksi SET is_finished = 'Pesanan selesai' WHERE id_transaksi = ${req.body.id_transaksi};`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
        
    },
    
    konfirmasipembayaranagent: (req,res) => {
        try {
            const path = '/images/paymentagent'; //file save path
            const upload = uploader(path, 'PAY').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
    
                const  {image}  = req.files;
                console.log(image)
                const imagePath = image ? path + '/' + image[0].filename : null;
                console.log(imagePath)
    
                console.log(req.body.data)
                // req.body.data.waktu = new Date();
                const data = JSON.parse(req.body.data);
                console.log(data)
                data.image = imagePath;                
               
                var sql = 'INSERT INTO paymentagent SET ?';
                conn.query(sql, data, (err, results) => {
                    console.log(data)
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                   
                    console.log(results);
                    sql = 'SELECT * from paymentagent;';
                    conn.query(sql, (err, results) => {
                        if(err) {
                            console.log(err.message);
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                        }
                        console.log(results);
                        res.send(results);
                    })
                      
                })    
            })
        } catch(err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
    },
        curency: (req, res) => {
        
        var sql = `SELECT *, c.id as id_curr from curency c LEFT JOIN negara n on n.id = c.id_negara`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        })
        
    },
    editcurency: (req, res) => {
        var { bronze, dollar,silver,gold, platinum, id} = req.body;
        console.log(id)
        var sql = `UPDATE curency SET bronze=${bronze}, dollar = ${dollar}, silver =${silver}, gold = ${gold}, platinum = ${platinum}
                    WHERE id = ${id};`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
       
    },
    cukai: (req, res) => {
        
        var sql = `SELECT 
        * from cukai_fee`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        })
        
    },
    editCukai: (req, res) => {
        var { bea_masuk,
            PPN,
            PPh,
            PPnBM,
        pungutan} = req.body;
        
        var sql = `UPDATE cukai_fee SET bea_masuk = ${bea_masuk}, PPN = ${PPN}, PPh = ${PPh}, PPnBM= ${PPnBM}, pungutan=${pungutan}
                    WHERE id = 1;`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
       
    },
    editPaket: (req, res) => {
        var { id,nama,harga,price} = req.body;
        
        var sql = `UPDATE paket SET nama = '${nama}', harga = ${harga}, price = '${price}'
                    WHERE id = ${id};`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })  
    },
    descpaketedit: (req, res) => {
        var {  id,detail1,detail2,detail3,detail4,detail5} = req.body;
        var data={
            detail1,detail2,detail3,detail4,detail5
        }
        var sql = `UPDATE paket SET ?
                    WHERE id = ${id};`;
        conn.query(sql,data, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })  
    },
    paket: (req, res) => {
        
        var sql = `SELECT 
        * from paket`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        })
        
    },
    shipping: (req, res) => {
        
        var sql = `SELECT 
        * from shipping LEFT JOIN negara ng on ng.id = shipping.id_negara`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        })
        
    },
    shippingedit: (req, res) => {
        var { bronze,silver,gold,platinum,id_negara} = req.body;
        
        var sql = `UPDATE shipping SET bronze=${bronze}, silver =${silver}, gold = ${gold}, platinum = ${platinum}
                    WHERE id_negara = '${id_negara}';`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
       
    },
    transactionfee: (req, res) => {
        
        var sql = `SELECT 
        * from transactionfee`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        })
        
    },
    transationedit: (req, res) => {
        var { bronze,silver,gold,platinum} = req.body;
        
        var sql = `UPDATE transactionfee SET bronze=${bronze}, silver =${silver}, gold = ${gold}, platinum = ${platinum}
                    WHERE id = 1;`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
       
    },

    toSuperdata: (req, res) => {

        var { id_negara } = req.body

        var sql = `SELECT 
        sd.id_produk,
        sd.nama_produk,
        sd.harga,
        SUM(sd.jumlah) as jml,
        SUM(sd.total_harga) as tot_harga,
        sd.id_transaksi,
        sd.waktu,
        p.gambar
        FROM superdata as sd
        LEFT JOIN produk p on p.id = sd.id_produk
        WHERE p.id_negara = ${id_negara} AND sd.status = 1
        GROUP BY sd.nama_produk ORDER BY nama_produk ASC`

        conn.query(sql, (err, result) => {
            if(err) throw err;
            
            console.log(result)
            res.send(result)

        })

    },

    listPS: (req, res) => {

        var { id_negara } = req.body

        var psql = `SELECT 
        ps.id_user as id_ps,
        ps.nama as nama_ps
        FROM personalshopper ps 
        WHERE ps.id_negara = ${id_negara}`

        conn.query(psql, (err, result) => {
            if(err) throw err;
            res.send(result)

        })

    },

    getAllcustomer: (req, res) => {

        var { id_produk, id_shopper, produk } = req.body;

        var sql = `INSERT INTO order_shopper SET ?`

        var data = {
            id_produk,
            id_shopper
            
        }

        var sqlg = `SELECT * FROM superdata sd 
        LEFT JOIN customers cs on cs.id_customer = sd.id_customer 
        LEFT JOIN personalshopper ps on ps.id_user = ${id_shopper}
        WHERE sd.id_produk = "${id_produk}" AND sd.status < 2 AND sd.id_transaksi`

        conn.query(sqlg, (err, result)=> {
            if(err) throw err
            res.send(result)
        })

        // conn.query(sql, data,(err, result) => {
        //     if(err) throw err;

        //         var upda = `UPDATE superdata SET status = 2, id_ps = ${id_shopper} WHERE id_produk = ${id_produk} && NOT status > 2;`;
        //         conn.query(upda, (err, result2) => {
        //             if(err) throw err;

                    

        //         })

        //         res.send(result)

        // })


    },

    allOrderSdata: (req, res) => {

        var {id_pes} = req.body

        var sql = `SELECT 
        sd.id_produk,
        sd.nama_produk,
        sd.harga,
        sd.terkumpul,
        sd.id_transaksi,
        SUM(sd.jumlah) as jml,
        SUM(sd.total_harga) as tot_harga,
        sd.id_transaksi,
        sd.waktu,
        ps.nama,
        ps.id_negara,
        p.gambar,
        n.negara
        FROM superdata as sd
        LEFT JOIN personalshopper ps  on ps.id_user = ${id_pes}
        LEFT JOIN negara n on n.id = ps.id_negara
        LEFT JOIN produk p on p.id = sd.id_produk
        WHERE sd.id_ps = ${id_pes} AND sd.status = 2
        GROUP BY sd.nama_produk ORDER BY nama_produk ASC`

        conn.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result)

        })


    },

    prosesSuperData: (req, res) => {

        var { id_negara } = req.body

        var sql = `SELECT 
        sd.id_produk,
        sd.nama_produk,
        sd.harga,
        sd.terkumpul,
        SUM(sd.jumlah) as jml,
        SUM(sd.total_harga) as tot_harga,
        sd.id_transaksi,
        p.gambar
        FROM superdata as sd
        LEFT JOIN produk p on p.id = sd.id_produk
        WHERE p.id_negara = ${id_negara} AND sd.status = 2
        GROUP BY sd.nama_produk ORDER BY nama_produk ASC`

        conn.query(sql, (err, result) => {
            if(err) throw err;
            
            console.log(result)
            res.send(result)

        })

    },

    updatePengumpulan: (req, res) => {

        var { nama, terkumpul, status, id_transaksi, pembagian } = req.body

        var sql = `UPDATE superdata SET terkumpul = ${terkumpul}, status = ${status} WHERE nama_produk = '${nama}' AND status = 2`
        // id_transaksi = ${id_transaksi}
        conn.query(sql, (err, result) => {
            if(err) throw err
            res.send(result)
        })

    },

    totalIncome: (req, res) => {

        var sql = `SELECT 
        TR.id_transaksi,u.username, TR.waktu AS waktu_transaksi, TR.total_bayar, TR.total_berat, TR.is_finished
        FROM transaksi TR
        join users u on u.id = TR.id_agent
        WHERE NOT TR.is_finished = "no"
        ORDER BY waktu_transaksi DESC`;

        conn.query(sql, (err, result) => {
            if(err) throw err

            res.send(result)

        })


    },

    getshippingCustomer: (req, res) => {

        var { id_shopper } = req.body
        
        var sql = `SELECT 
		cs.id_customer,
        cs.nama_lengkap,
        sd.batchNo,
        sd.ship,
        sd.id_transaksi,
        sd.waktu
        FROM superdata sd 
        LEFT JOIN customers cs on cs.id_customer = sd.id_customer
        WHERE sd.id_ps = ${id_shopper}
        GROUP BY cs.nama_lengkap`

        conn.query(sql, (err, result) => {
            
            if(err) throw err
            
            res.send(result)

        })


    },

    getListShipping: (req, res) => {

        var { nama_customer } = req.body

        var sql = `SELECT 
        sd.nama_produk,
        SUM(sd.jumlah) as tot_jml
        FROM superdata sd
        LEFT JOIN customers cs on cs.id_customer = sd.id_customer
        WHERE cs.nama_lengkap = '${nama_customer}' AND sd.id_ps = 4 AND NOT sd.status < 3
        GROUP BY sd.nama_produk`

        conn.query(sql, (err, result) => {
            if(err) throw err

            res.send(result)

        })


    },

    getDetailShippingCustomer: (req, res) => {

        var { nama_customer } = req.body

        var sql = `SELECT 
        cs.nama_lengkap,
        cs.alamat,
        cs.kecamatan,
        cs.kota,
        cs.provinsi,
        cs.kodepos
        FROM customers cs
        WHERE cs.nama_lengkap = '${nama_customer}'`

        conn.query(sql, (err, result) => {
            if(err) throw err

            res.send(result)

        })


    },


    getHistoryatShopper: (req, res) => {

        var sql = `SELECT 
        sd.id_transaksi,
        sd.waktu
        FROM superdata sd
        LEFT JOIN customers cs on cs.id_customer = sd.id_customer
        LEFT JOIN personalshopper ps on ps.id_user = sd.id_ps
        WHERE sd.status > 2
        GROUP BY sd.id_transaksi`

        conn.query(sql, (err, result) => {

            if(err) throw err

            res.send(result)

        })


    },

    getDetailHistoryShopper: (req, res) => {

        var { id_tr } = req.body
        
        var sql = `SELECT 
        sd.nama_produk,
        sd.jumlah as jml,
        sd.status,
        sd.terkumpul,
        sd.id_ps,
        cs.nama_lengkap,
        p.gambar
        FROM superdata as sd
        LEFT JOIN produk p on p.id = sd.id_produk
        LEFT JOIN customers cs on cs.id_customer = sd.id_customer
        WHERE sd.id_transaksi = '${req.params.id_tr}'`

        conn.query(sql, (err, result) => {
            if(err) throw err

            res.send(result)

        })

    },

    allConvert: (req, res) => {

        var sql = `SELECT cr.dollar, cr.hasil, n.negara FROM converts cr LEFT JOIN negara n on n.id = cr.id_negara`

        conn.query(sql, (err, result) => {
            if(err) throw err
            
            res.send(result)
        })

    }, 

    getNegaraConvert: (req, res) => {

        var sql = `SELECT * FROM curency WHERE curency.id_negara = ${req.body.id_negara}`

        conn.query(sql, (err, result) => {

            if(err) throw err

            res.send(result)

        })

    },

    getAllItem: (req, res) => {

        var sql = `SELECT  
        sd.nama_produk as item_desc, 
        sd.harga as item_price_value, 
        sd.jumlah as item_quantity, 
        sd.id_produk,
        'Fashion Apparel' as item_category,
        'IDR' as item_price_currency
        FROM superdata sd 
        LEFT JOIN produk p on p.id = sd.id_produk
        LEFT JOIN kategori k on k.id = p.id_kategori
        LEFT JOIN customers cs on cs.id_customer = '${req.params.id_customer}'
        WHERE sd.status = '1' AND sd.id_customer = '${req.params.id_customer}' AND p.id_negara = '${req.params.id_negara}'
        GROUP BY sd.nama_produk`

        conn.query(sql, (err, result) => {

            if(err) throw err
            res.send(result)

        })

    },
    
    updatePS: (req, res) => {

        var { id_produk, id_shopper, ship, trackNo, id_customer, batchNo, waktu } = req.body;

        var sql = `INSERT INTO order_shopper SET ?`

        var data = {
            id_produk,
            id_shopper
            
        }
        
        console.log(trackNo)

        conn.query(sql, data,(err, result) => {
            if(err) throw err;

                var upda = `UPDATE superdata SET status = 2, id_ps = ${id_shopper}, ship = ${ship}, trackNo = '${trackNo}', batchNo = '${batchNo}', waktu = '${waktu}' WHERE id_produk = '${id_produk}' && status < 2 ;`;
                conn.query(upda, (err, result2) => {
                    if(err) throw err;

                })

                res.send(result)

        })
    },

    getAllTrans: (req, res) => {

        var sql = `SELECT sd.id_transaksi, sd.waktu 
        FROM superdata sd 
        WHERE sd.ship = 1 AND sd.status > 1
        GROUP BY sd.id_transaksi
        ORDER BY sd.waktu DESC`

        conn.query(sql, (err, result) => {

            if(err) throw err
            res.send(result)
        })

    },

    getAllJanio: (req, res) => {


        var sql = `SELECT cs.nama_lengkap, sd.status, sd.batchNo FROM superdata sd 
        LEFT JOIN customers cs on cs.id_customer = sd.id_customer 
        WHERE sd.id_transaksi = "${req.params.transaksi}" 
        GROUP BY sd.id_customer`

        conn.query(sql, (err, result) => {
            if(err) throw err
            res.send(result)
        })

    },
    
    getJanioShopper: (req, res) => {

        

        var sql = `SELECT sd.id_transaksi, sd.waktu 
        FROM superdata sd 
        WHERE sd.status > 1 AND sd.id_ps = ${req.params.shopper} AND sd.ship = 1
        GROUP BY sd.id_transaksi
        ORDER BY sd.waktu DESC`

        conn.query(sql, (err, result) => {
            if(err) throw err
            res.send(result)

        })


    },

    getPJTShopper: (req, res) => {
                    
        

        var sql = `SELECT sd.id_transaksi, sd.waktu 
        FROM superdata sd 
        WHERE sd.status = 2 AND sd.id_ps = ${req.params.shopper} AND sd.ship = 2
        GROUP BY sd.id_transaksi
        ORDER BY sd.waktu DESC`

        conn.query(sql, (err, result) => {
            if(err) throw err
            res.send(result)

        })


    },

    getShopperNegara: (req, res) => {

        var sql = `SELECT * FROM personalshopper ps 
        LEFT JOIN negara n on n.id = ps.id_negara
        WHERE ps.id_user = '${req.body.ps}';`

        conn.query(sql, (err, result) => {
            if(err) throw err
            res.send(result)
        })

    },


    // ================================  AUTO UPDATE JANIO  ============================ \\


    getTrans: (req, res) => {

        var {batch, status} = req.body

        if(status == 'SUCCESS'){
            var stat = "Success"
        }else if( status == 'ORDER_RECEIVED_AT_DESTINATION_WAREHOUSE'){
            var stat = "Barang sudah sampai Di Gudang"
        }else{
            var stat = "Sedang di Proses"
        }


        var sql = `UPDATE transaksi tr
        LEFT JOIN superdata sd on sd.id_transaksi = tr.id_transaksi
        SET tr.is_finished = "${stat}"
        WHERE sd.batchNo = '${batch}'`;

        conn.query(sql, (err, result) => {
            if(err) throw err

            res.send(result)

        })


    },

    // ================================  PJT  ============================ \\

    getCustPjt: (req, res) => {
        
        var sql = `SELECT cs.nama_lengkap, sd.status, sd.batchNo FROM superdata sd 
        LEFT JOIN customers cs on cs.id_customer = sd.id_customer 
        WHERE sd.id_transaksi = "${req.params.transaksi}" 
        GROUP BY sd.id_customer`

        conn.query(sql, (err, result) => {
            if(err) throw err
            res.send(result)
        })


    },

    

     // ================================  NEW Janio  ============================ \\

     getListCustomer: (req, res) => {

        var sql = `SELECT 
        sp.id_transaksi, 
        sp.waktu,
        sp.status
        FROM superdata sp 
        WHERE sp.id_ps = ${req.body.id_ps}
        GROUP BY sp.waktu
        ORDER BY sp.id DESC`

        conn.query(sql, (err, result) => {
            if(err) throw err

            res.send(result)
        })

     },

     getJumlahBarang: (req, res) => {

        var sql = `SELECT 
        sd.jumlah,
        sd.id_customer,
        sd.id_transaksi
        FROM superdata sd 
        WHERE sd.status = 2 AND sd.nama_produk = '${req.body.nama}' AND sd.id_ps = ${req.body.id}
        ORDER BY sd.jumlah ASC`

        conn.query(sql, (err, result) => {

            if(err) throw err

            res.send(result)
            
        })

     },

     updatePembagian: (req, res) => {

        var { pembagian, id_tr, nama, id_cus } = req.body

        var sql = `UPDATE superdata sd SET sd.pembagian = '${pembagian}'
        WHERE sd.id_transaksi = '${id_tr}' 
        AND sd.nama_produk = '${nama}' 
        AND sd.id_customer = '${id_cus}'`

        conn.query(sql, (err, result) => {

            if(err) throw err
            res.send(result)

        })

     },

     getListEnduser: (req, res) => {

        var sql = `SELECT 
        *
        FROM superdata sd 
        LEFT JOIN personalshopper ps on ps.id_user = sd.id_ps
        LEFT JOIN customers cs on cs.id_customer = sd.id_customer
        WHERE sd.waktu = '${req.body.waktu}' GROUP BY sd.id_customer`

        conn.query(sql, (err, result) => {
            if(err) throw err
            res.send(result)
        })

     }, 


     getBarangEnduser : (req, res) => {

        var sql = `SELECT *,
        IF(sd.pembagian < 0, sd.jumlah + sd.pembagian, sd.jumlah) as jumlah_barang
        FROM superdata sd 
        LEFT JOIN produk p on p.id = sd.id_produk
        WHERE sd.status > 1 
        AND sd.id_customer = ${req.body.id_cu} 
        AND sd.id_transaksi = '${req.body.transaksi}'`

        conn.query(sql, (err, result) => {
            if(err) throw err
            res.send(result)

        })

     },

     getCustomerInfo: (req, res) => {

        var sql = `SELECT  
        sd.nama_produk as item_desc, 
        sd.harga * 15000 as item_price_value, 
        IF(sd.pembagian < 0, sd.jumlah + sd.pembagian, sd.jumlah) as item_quantity, 
        sd.id_produk,
        'Others' as item_category,
        'IDR' as item_price_currency,
        sd.berat as berat,
        sd.pembagian as bagi,
        sd.waktu,
        n.negara,
        n.kode as k_negara,
        IF(sd.pembagian < -sd.jumlah, '0' , IF(sd.pembagian < 0, sd.jumlah + sd.pembagian, sd.jumlah)) as check_b
        FROM superdata sd 
        LEFT JOIN produk p on p.id = sd.id_produk
        LEFT JOIN negara n on n.id = p.id_negara
        LEFT JOIN kategori k on k.id = p.id_kategori
        LEFT JOIN customers cs on cs.id_customer = '${req.params.id_customer}'
        WHERE sd.id_customer = '${req.params.id_customer}' AND p.id_negara = '${req.params.id_negara}' AND sd.id_transaksi = '${req.params.id_transaksi}'
        GROUP BY sd.nama_produk HAVING check_b > 0`

        conn.query(sql, (err, result) => {

            if(err) throw err
            res.send(result)

        })

     },

     updateSD: (req, res) => {

        var sql = `UPDATE superdata sd SET 
        status = 4, 
        batchNo = '${req.body.batch}', 
        trackNo = '${req.body.track}', 
        urlorder = '${req.body.url}' 
        WHERE sd.id_transaksi = '${req.body.id_transaksi}' AND sd.id_customer = '${req.body.id_customer}'`

        conn.query(sql, (err, result) => {
            if(err) throw err
            res.send(result)
        })

     },


     allClear: (req, res) => {
         
        var sql = `UPDATE superdata SET status = '5' WHERE 
        id_customer = '${req.body.customer}' 
        AND id_ps = '${req.body.id_ps}'
        AND id_transaksi = '${req.body.transaksi}'`

        conn.query(sql, (err, result) => {
            if(err) throw err

            res.send(result)

        })

     },


     allDetailsuperdata: (req, res) => {

        var { waktu, produk } = req.body

        var sql = `SELECT 
        sd.catatan,
        cs.nama_lengkap  
        FROM superdata sd 
        LEFT JOIN customers cs on cs.id_customer = sd.id_customer
        WHERE sd.id_produk = "${produk}" AND sd.waktu = "${waktu}" AND NOT sd.status > 2
        GROUP BY sd.id_customer`

        conn.query(sql, (err, result) => {

            if(err) throw er
            res.send(result)

        })

     },

     getOneCustomer: (req, res) => {

        var sql = `SELECT * FROM customers cs WHERE id_customer = ${req.body.customer}`

        conn.query(sql, (err, result) => {
                
            if(err) throw err

            res.send(result)

        })

     },

     getAllUploadBatch: (req, res) => {

        var sql = `SELECT sd.batchNo
        FROM superdata sd 
        LEFT JOIN transaksi tr on tr.id_transaksi = sd.id_transaksi
        WHERE sd.ship = 1 
        AND NOT sd.batchNo = "null" 
        AND NOT sd.batchNo = ""
        AND NOT tr.is_finished = "Success"` 

        conn.query(sql, (err, result) => {
            if(err) throw err

            res.send(result)
        })

     },



     batalPesanan: (req, res) => {

        var { transaksi } = req.body

        var sql1 = `DELETE FROM transaksi WHERE id_transaksi = "${transaksi}"`
        var sql2 = `DELETE FROM detail_transaksi WHERE id_transaksi = "${transaksi}"`
        var sql3 = `DELETE FROM manifest WHERE id_transaksi = "${transaksi}"`
        var sql4 = `DELETE FROM superdata WHERE id_transaksi = "${transaksi}"`

        conn.query(sql1, (err, result) => {
            if(err) throw err
            conn.query(sql2, (err, result) => {
                if(err) throw err
                conn.query(sql3, (err, result) => {
                    if(err) throw err
                    conn.query(sql4, (err, result) => {
                        if(err) throw err
                        res.send(result)

                    })

                })

            })    

        })

     }


}

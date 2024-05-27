import Swal from "sweetalert2"
import Backoffice from "../../components/backoffice"
import Modal from "../../components/modal"
import {  useEffect,useRef,useState } from "react"
import axios from "axios"
import config from "../../config"


function Product (){

    const [product, setProduct] = useState({}); //สร่าง แัพเดท
    const [products, setProducts] = useState([]);//show
    const [img,setImg] = useState({});
    const [fileexcel, setfileexcel] = useState({});
    const refimg = useRef();
    const refexcel =useRef();

    useEffect(() => {
        fetchData();
    }, []);

    const handleupload  = async () =>{
        try{
       
            const formdata =new FormData();
            formdata.append('img',img);

            const res = await axios.post(config.apiPath +'/product/upload',formdata,{
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem('token')
                }
            })
            if (res.data.newname !== undefined ) {
                return res.data.newname;
            }
        
     
        }catch (e){
            Swal.fire({
                title:'error',
                text:e.message,
                icon:'error'
            })
            return "";
        }
    }

    const handleSave = async () => {
        try {
         
            product.img = await handleupload();
            product.price = parseInt(product.price);
            product.cost = parseInt(product.cost);
        
            let res;

            if (product.id === undefined) {
                res = await axios.post(config.apiPath + '/product/create', product, config.headers());
            } else {
                res = await axios.put(config.apiPath + '/product/update', product, config.headers());
            }

            if (res.data.message === 'success') {
                Swal.fire({
                    title: 'save',
                    text: 'success',
                    icon: 'success',
                    timer: 500 // 1000 = 1 วินาที
                })
                document.getElementById('modalProduct_btnClose').click();
                fetchData();

                setProduct({ ...product, id: undefined }); // Clear id
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }
    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/product/list', config.headers());
           /*  console.log(res.data) */
            if (res.data.results !== undefined) {
                setProducts(res.data.results);
            } 
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }
    const clearForm = () => {
        setProduct({
            name: '',
            price: '',
            cost: ''
        })
        setImg(null);
        refimg.current.value = '';
    }
    const handleremove = async (item) =>{
        try{
            const button  =await Swal.fire({
                    title:'remove ',
                    text:'remove item',
                    icon:'question',
                    showCancelButton :true,
                    showConfirmButton :true
                })
          
                if(button.isConfirmed){
                    const res = await axios.delete(config.apiPath + '/product/remove/'+ item.id, config.headers())
                    if(res.data.message === 'success'){
                        Swal.fire({
                            title: 'remove',
                            text: 'remove success',
                            icon: 'success',
                            timer: 1000
                        })
                        fetchData();
                    }
                }
        }catch (e){
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }
    const selectFile = (inputFile) => {
        if (inputFile !== undefined) {
            if (inputFile.length > 0) {
                setImg(inputFile[0]);
            }
        }
    }

    const showImage = (item) =>{
        if(item.img !== ""){
            return  <img alt='' className="img-fluid" src={config.apiPath + '/upload/'+ item.img} /> ;
         

        
        }
        return <></>
    }

    const selectFileExcel = (filesinput) =>{
        if(filesinput !== undefined){
            if(filesinput.length > 0){
                setfileexcel(filesinput[0])
            }
        }

    }

    const handleuploadexcel = async () =>{
        try{
            const formData = new FormData()
            formData.append('fileexcel',fileexcel)
            const res = await axios.post(config.apiPath + '/product/uploadfromexcel', formData,{
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem('token')
                }
            })
            if(res.data.message === 'success'){
                Swal.fire({
                    title: 'uploapFile ',
                    text: 'uploap success',
                    icon: 'success',
                    timer: 1000
                })
                fetchData();

                document.getElementById('modalexcel_btnClose').click();
            }
        }catch (e){
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }

    }
    const clearFormexcel = () =>{
        refexcel.current.value ='';
        setfileexcel(null)
    }

    return <Backoffice>
        <div className="h4">Product</div>
        <button  onClick={clearForm} className="btn btn-primary mr-2" data-toggle='modal' data-target='#modalProduct'>
            <i className="fa fa-plus mr-2"></i>เพิ่มรายการ
        </button>
        <button  onClick={clearFormexcel} className="btn btn-success" data-toggle='modal' data-target='#modalexcel'>
            <i className="fa fa-arrow-down mr-2"></i> import form excel
        </button>
        <table className="mt-3 table table-bordered table-striped">
            <thead>
                <tr>
                    <th  width='150px'>
                        picture
                    </th>
                    <th>
                        name 
                    </th>
                    <th>
                        cost 
                    </th>
                    <th>
                        price 
                    </th>
                </tr>
            </thead>
            <tbody>
                {products.length > 0 ? products.map(item => 
                    <tr key={item.id}>

                        <td>{showImage(item)}</td>
                        <td>{item.name}</td>
                        <td>{item.cost}</td>
                        <td>{item.price}</td>
                        <td className="text-center">
                            <button className="btn btn-primary mr-2" data-toggle='modal' data-target='#modalProduct' onClick={e => setProduct(item)}><i className="fa fa-edit" ></i></button>
                            <button className="btn btn-danger mr-2" onClick={e => handleremove(item)}><i className="fa fa-times"></i></button>
                        </td>
                    </tr>
                 ):<></>}
            </tbody>
        </table>

        <Modal id='modalProduct' title='สินค้า'>
            <div>
                <div>ชื่อสินค้า</div>
                <input value={product.name} className="form-control" onChange={e => setProduct({ ...product, name: e.target.value })} />
            </div>
            <div className="mt-3">
                <div>ราคาทุน</div>
                <input value={product.cost} className="form-control" onChange={e => setProduct({ ...product, cost: e.target.value })} />
            </div>
            <div className="mt-3">
                <div>ราคาขาย</div>
                <input value={product.price} className="form-control" onChange={e => setProduct({ ...product, price: e.target.value })} />
            </div>
            <div className="mt-3">
                <div className="mt-3">{showImage(product)}</div>
                <div>ภาพสินค้า</div>
                <input className="form-control" type="file" ref={refimg} onChange={e=> selectFile(e.target.files)}/>
            </div>
            <div className="mt-3">
                <button className="btn btn-primary" onClick={handleSave}>
                    <i className="fa fa-check mr-2"></i>Save
                </button>
            </div>
        </Modal>

        <Modal id='modalexcel' title='เลือกไฟล์'>
            <div>เลือกไฟล์</div>
            <input className="form-control" type="file" ref={refexcel} onChange={e => selectFileExcel(e.target.files)}/>
            <button className="mt-3 btn btn-primary" onClick={handleuploadexcel}>
                <i className="fa fa-check mr-2"></i>Save
            </button>
        </Modal>
    </Backoffice>
}
export default Product
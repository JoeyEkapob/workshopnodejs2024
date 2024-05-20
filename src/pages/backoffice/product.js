import Swal from "sweetalert2"
import Backoffice from "../../components/backoffice"
import Modal from "../../components/modal"
import {useEffect,useState } from "react"
import axios from "axios"
import config from "../../config"


function Product (){

    const [product, setProduct] = useState({}); //สร่าง แัพเดท
    const [products, setProducts] = useState([]);//show

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async () =>{
        try{
            product.img = "";
            product.price = parseInt(product.price);
            product.cost = parseInt(product.cost);

            const res = await axios.post(config.apiPath + '/product/create', product,config.headers());
           
            if(res.data.message ==='success'){
                Swal.fire({
                    title:'save',
                    text:'success',
                    icon:'success',
                    timer:2000
                })
                document.getElementById('modalProduct_btnClose').click();
                fetchData();
            }
        }catch (e){
            Swal.fire({
                title:'error',
                text:e.message,
                icon:'error'
            })
        }
    }
    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/product/list', config.headers());
            console.log(res.data)
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

                }
        }catch (e){
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    return <Backoffice>
        <div className="h4">Product</div>
        <button  onClick={clearForm} className="btn btn-primary" data-toggle='modal' data-target='#modalProduct'>
            <i className="fa fa-plus"></i>เพิ่มรายการ
        </button>
        <table className="mt-3 table table-bordered table-striped">
            <thead>
                <tr>
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
                {console.log(products)}
                {products.length > 0 ? products.map(item => 
                    <tr>
                        <td>{item.name}</td>
                        <td>{item.cost}</td>
                        <td>{item.price}</td>
                        <td className="text-center">
                            <button className="btn btn-primary mr-2"><i className="fa fa-edit"></i></button>
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
                <div>ภาพสินค้า</div>
                <input className="form-control" type="file" />
            </div>
            <div className="mt-3">
                <button className="btn btn-primary" onClick={handleSave}>
                    <i className="fa fa-check mr-2"></i>Save
                </button>
            </div>
        </Modal>
    </Backoffice>
}
export default Product
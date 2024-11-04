import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { IoCloseSharp } from "react-icons/io5";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import CircularProgress from '@mui/material/CircularProgress';
import { FaRegImages } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React, { useRef, useState, useEffect, useContext } from 'react';
import Rating from '@mui/material/Rating';
import { FaCloudUploadAlt } from "react-icons/fa";
import Button from '@mui/material/Button';
import { MyContext } from '../../App';
import { fetchDataFromApi, postData, deleteData, deleteImages, uploadImage } from '../../utils/api';
//breadcrumb code
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

const ProductUpload = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [imgFiles, setImgFiles] = useState();
    const [categoryVal, setcategoryVal] = useState('');
    const [subCatVal, setSubcatVal] = useState('');
    const [uploading, setUploading] = useState(false);

    const [ratingsValue, setRatingValue] = useState(0);
    const [hover, setHover] = React.useState(2);
    const [isFeaturedValue, setisFeaturedValue] = useState('')
    const [isRecommend, setisRecommend] = useState('')
    const [isNewrelesse, setisNewrelesse] = useState('')
    const [productImagesArr, setProductImagesArr] = useState([])
    const [count, setCount] = useState(0)
    const [previews, setPreviews] = useState([])
    const history = useNavigate();
    const [formFields, setFormFields] = useState({


        name: '',
        description: '',
        images: [], 
        author: '',
        price: 0,
        oldPrice: 0,
        category: '',
        subCat: '',
        catName: '',
        subCatId: '',
        countInStock: 0,
        rating: 0,
        discountPercentage: 0,
        isFeatured: false,
        isRecommend: false,
        isNewrelease: false,
        subCatName: '',



    })
    const formdata = new FormData();
    const context = useContext(MyContext);

    const [catData, setCatData] = useState([])
    const [subCatData, setSubCatData] = useState([])

    const [files, setFiles] = useState([])
    const productImages = useRef();
    const [isSelectedFiles, setIsSelectedFiles] = useState(false);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);



    useEffect(() => {
        window.scrollTo(0, 0);
        setCatData(context.catData);
        setSubCatData(context.subCatData)
        fetchDataFromApi("/api/imageUpload").then((res) => {
            res?.map((item) => {
                item?.images?.map((img) => {
                    deleteImages(`/api/category/deleteImage?img=${img}`).then((res) => {
                        deleteData("/api/imageUpload/deleteAllImages");
                    })
                })
            })
        });

        

    }, []);


    const handleChangeCategory = (event) => {

        const selectedCategoryId = event.target.value;

        // Filter subcategories based on selected category
        const filtered = context.subCatData.subCategoryList.filter(
            (subcat) => subcat.category.id === selectedCategoryId
        );
        setFilteredSubCategories(filtered);
        setcategoryVal(event.target.value);
        setFormFields(() => ({
            ...formFields,
            category: event.target.value

        }))

        setSubcatVal('');
    };



    const handleChangeisRecommend = (event) => {
        setisRecommend(event.target.value);
        setFormFields(() => ({
            ...formFields,
            isRecommend: event.target.value

        }))
    }
    const handleChangeisNew = (event) => {
        setisNewrelesse(event.target.value);
        setFormFields(() => ({
            ...formFields,
            isNewrelease: event.target.value

        }))
    }

    const handleChangeisFeaturedValue = (event) => {
        setisFeaturedValue(event.target.value);
        setFormFields(() => ({
            ...formFields,
            isFeatured: event.target.value

        }))
    }
   
    const selectCat = (cat) => {
        formFields.catName = cat;
    }


    const inputChange = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value

        }))

    }

    let img_arr = [];
    let uniqueArray = [];
    let selectedImages = [];

    const onChangeFile = async (e, apiEndPoint) => {
        try {

            const files = e.target.files;
            console.log(e.target.files)
            setUploading(true);

            //const fd = new FormData();
            for (var i = 0; i < files.length; i++) {

                // Validate file type
                if (files[i] && (files[i].type === 'image/jpeg' || files[i].type === 'image/jpg' || files[i].type === 'image/png' || files[i].type === 'image/webp')) {

                    const file = files[i];

                    formdata.append(`images`, file);


                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: 'Please select a valid JPG or PNG image file.'
                    });

                    setUploading(false);
                    return false;
                }
            }

        } catch (error) {
            console.log(error)
        }

       
        // console.log("2",e.target.files)
        // console.log("2.5",formdata)
        uploadImage(apiEndPoint, formdata).then((res) => {
            // console.log(formdata)
            // console.log("3",e.target.files)
            fetchDataFromApi("/api/imageUpload").then((response) => {
                if (response !== undefined && response !== null && response !== "" && response.length !== 0) {

                    response.length !== 0 && response.map((item) => {
                        item?.images.length !== 0 && item?.images?.map((img) => {
                            img_arr.push(img)

                        
                        })
                    })


                    uniqueArray = img_arr.filter((item, index) => img_arr.indexOf(item) === index);

                    const appendedArray = [...previews, ...uniqueArray];



                    setPreviews(appendedArray);

                    setTimeout(() => {
                        setUploading(false);
                        img_arr = [];
                        context.setAlertBox({
                            open: true,
                            error: false,
                            msg: "Images Uploaded!"
                        })
                    }, 200);

                }

            });

        });


    }



    const removeImg = async (index, imgUrl) => {

        const imgIndex = previews.indexOf(imgUrl);

        deleteImages(`/api/category/deleteImage?img=${imgUrl}`).then((res) => {
            context.setAlertBox({
                open: true,
                error: false,
                msg: "Image Deleted!"
            })
        })

        if (imgIndex > -1) { // only splice array when item is found
            previews.splice(index, 1); // 2nd parameter means remove one item only
        }

    }



    const addProduct = (e) => {

        e.preventDefault();

        const appendedArray = [...previews, ...uniqueArray];

        img_arr = [];
        formdata.append('name', formFields.name);
        formdata.append('description', formFields.description);
        formdata.append('author', formFields.author);
        formdata.append('price', formFields.price);
        formdata.append('category', formFields.category);
        formdata.append('subCat', formFields.subCat);
        formdata.append('catName', formFields.catName);
        formdata.append('subCatId', formFields.subCatId);
        formdata.append('discountPercentage', formFields.discountPercentage);
        formdata.append('subCatName', formFields.subCatName);

        formdata.append('oldPrice', formFields.oldPrice);
        formdata.append('countInStock', formFields.countInStock);
        formdata.append('rating', formFields.rating);
        formdata.append('isFeatured', formFields.isFeatured);
        formdata.append('isNewrelease', formFields.isNewrelease);
        formdata.append('isReccomend', formFields.isRecommend);


        formFields.images = appendedArray

      

        if (formFields.name === "") {
            context.setAlertBox({
                open: true,
                msg: 'please add product name',
                error: true
            })
            return false;
        }



        if (formFields.description === "") {
            context.setAlertBox({
                open: true,
                msg: 'please add product description',
                error: true
            });
            return false;
        }

        if (formFields.author === "") {
            context.setAlertBox({
                open: true,
                msg: 'please add product author',
                error: true
            });
            return false;
        }

        if (formFields.discountPercentage === null) {
            context.setAlertBox({
                open: true,
                msg: 'please add discountPercentage',
                error: true
            });
            return false;
        }

        if (formFields.price === null) {
            context.setAlertBox({
                open: true,
                msg: 'please add product price',
                error: true
            });
            return false;
        }

        if (formFields.oldPrice === null) {
            context.setAlertBox({
                open: true,
                msg: 'please add product oldPrice',
                error: true
            });
            return false;
        }

        if (formFields.category === "") {
            context.setAlertBox({
                open: true,
                msg: 'please select a category',
                error: true
            });
            return false;
        }
        if (formFields.subCat === "") {
            context.setAlertBox({
                open: true,
                msg: 'please select sub category',
                error: true
            })
            return false;
        }

        if (formFields.countInStock === null) {
            context.setAlertBox({
                open: true,
                msg: 'please add product count in stock',
                error: true
            });
            return false;
        }

        if (formFields.rating === 0) {
            context.setAlertBox({
                open: true,
                msg: 'please select product rating',
                error: true
            });
            return false;
        }

        if (formFields.isFeatured === null) {
            context.setAlertBox({
                open: true,
                msg: 'please select the product is a featured or not',
                error: true
            });
            return false;
        }

        if (formFields.isRecommend === null) {
            context.setAlertBox({
                open: true,
                msg: 'please select the product is a recommend or not',
                error: true
            });
            return false;
        }

        if (formFields.isNewrelease === null) {
            context.setAlertBox({
                open: true,
                msg: 'please select the product is a New release or not',
                error: true
            });
            return false;
        }





        setIsLoading(true)
        
        postData('/api/products/create', formFields).then((res) => {
           
            context.setAlertBox({
                open: true,
                msg: 'the product is created!',
                error: false
            })
            setIsLoading(false)
            // setFormFields({
            //     name: '',
            //     description: '',
            //     brand: '',
            //     price: 0,
            //     oldPrice: 0,
            //     category: '',
            //     countInStock: 0,
            //     rating: 0,
            //     isFeatured: false,
            //     images: []
            // })
            deleteData("/api/imageUpload/deleteAllImages");
            history('/products')
        })


    }

    const handleChangeSubCategory = (event) => {
        const selectedValue = event.target.value;
        const selectedSubCat = context.subCatData?.subCategoryList?.find(subcat => subcat.id === selectedValue);

        setSubcatVal(selectedValue);
        setFormFields((prevState) => ({
            ...prevState,
            subCat: selectedValue,
            subCatId: selectedSubCat?.id || '',
            subCatName: selectedSubCat?.subCat || ''
        }));
    };


    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4">
                    <Breadcrumbs aria-label="breadcrumb" className="me-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Dashboard"
                        />

                        <StyledBreadcrumb
                            component="a"
                            label="Products"
                            href="#"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                        <StyledBreadcrumb
                            label="Product Upload"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>

                <form className='form' onSubmit={addProduct}>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='card p-4'>

                                <div className='form-group'>
                                    <h6>PRODUCT NAME</h6>
                                    <input type='text' name='name' value={formFields.name} onChange={inputChange} />
                                </div>

                                <div className='form-group'>
                                    <h6>DESCRIPTION</h6>
                                    <textarea rows={14} cols={10} name='description' value={formFields.description} onChange={inputChange} />
                                </div>



                                <div className='row'>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>CATEGORY</h6>
                                         

                                            <Select
                                                value={categoryVal}
                                                onChange={handleChangeCategory}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className='w-100'
                                            >
                                                <MenuItem value="">
                                                    <em value={null}>None</em>
                                                </MenuItem>
                                                {context.catData.categoryList.map((cat, index) => (
                                                    <MenuItem value={cat.id} key={index} onClick={()=>selectCat(cat.name)}>
                                                        {cat.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>SUBCATEGORY</h6>
                                           

                                            <Select
                                                value={subCatVal}
                                                onChange={handleChangeSubCategory}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className='w-100'
                                                disabled={!categoryVal} 
                                            >
                                                <MenuItem value="">
                                                    <em value={null}>None</em>
                                                </MenuItem>
                                                {filteredSubCategories.length > 0 && filteredSubCategories.map((subcat, index) => (
                                                    <MenuItem value={subcat.id} key={index}>
                                                        {subcat.subCat}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6 className='text-uppercase'>IS FEATURE</h6>
                                            <Select
                                                value={isFeaturedValue}
                                                onChange={handleChangeisFeaturedValue}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className='w-100'
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value={true}>True</MenuItem>
                                                <MenuItem value={false}>False</MenuItem>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6 className='text-uppercase'>RECOMMEND</h6>
                                            <Select
                                                value={isRecommend}
                                                onChange={handleChangeisRecommend}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className='w-100'
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value={true}>True</MenuItem>
                                                <MenuItem value={false}>False</MenuItem>
                                            </Select>
                                        </div>
                                    </div>

                                </div>


                                <div className='row'>
                                <div className='col'>
                                        <div className='form-group'>
                                            <h6 className='text-uppercase'>NEW RELEASE</h6>
                                            <Select
                                                value={isNewrelesse}
                                                onChange={handleChangeisNew}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className='w-100'
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value={true}>True</MenuItem>
                                                <MenuItem value={false}>False</MenuItem>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>OLD PRICE </h6>
                                            <input type='text' name='oldPrice' value={formFields.oldPrice} onChange={inputChange} />
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>PRICE</h6>
                                            <input type='text' name='price' value={formFields.price} onChange={inputChange} />
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>STOCK</h6>
                                            <input type='text' name='countInStock' value={formFields.countInStock} onChange={inputChange} />
                                        </div>
                                    </div>
                                </div>


                                <div className='row'>
                                    <div className='col-md-3'>
                                        <div className='form-group'>
                                            <h6>Discount %</h6>
                                            <input type='text' name='discountPercentage' value={formFields.discountPercentage} onChange={inputChange} />
                                        </div>
                                    </div>
                                    <div className='col-md-3'>
                                        <div className='form-group'>
                                            <h6>AUTHOR</h6>
                                            <input type='text' name='author' value={formFields.author} onChange={inputChange} />
                                        </div>
                                    </div>


                                    <div className='col-md-6'>
                                        <div className='form-group'>
                                            <h6>RATINGS</h6>

                                            <Rating
                                                name="simple-controlled"

                                                value={ratingsValue}
                                                onChange={(event, newValue) => {
                                                    setRatingValue(newValue);
                                                    setFormFields(() => ({
                                                        ...formFields,
                                                        rating: newValue
                                                    }))
                                                }}
                                            />

                                        </div>

                                    </div>
                                </div>



                            </div>


                        </div>



                    </div>

                    <div className='card p-4 mt-0'>
                        <div className="imagesUploadSec">
                            <h5 className="mb-4">Media And Published</h5>

                            <div className='imgUploadBox d-flex align-items-center'>

                                {
                                    previews?.length !== 0 && previews?.map((img, index) => {
                                        return (
                                            <div className='uploadBox' key={index}>
                                                <span className="remove" onClick={() => removeImg(index, img)}><IoCloseSharp /></span>
                                                <div className='box'>
                                                    <LazyLoadImage
                                                        alt={"image"}
                                                        effect="blur"
                                                        className="w-100"
                                                        src={img} />
                                                </div>
                                            </div>
                                        )
                                    })
                                }




                                <div className='uploadBox'>

                                    {
                                        uploading === true ?
                                            <div className="progressBar text-center d-flex align-items-center justify-content-center flex-column">
                                                <CircularProgress />
                                                <span>Uploading...</span>
                                            </div>
                                            :

                                            <>
                                                <input type="file" multiple onChange={(e) => onChangeFile(e, '/api/products/upload')} name="images" />
                                                <div className='info'>
                                                    <FaRegImages />
                                                    <h5>image upload</h5>
                                                </div>
                                            </>

                                    }

                                </div>


                            </div>

                            <br />

                            <Button type="submit" disabled={uploading === true ? true : false} className="btn-blue btn-lg btn-big w-100"
                            ><FaCloudUploadAlt /> &nbsp;  {isLoading === true ? <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'}  </Button>
                        </div>
                    </div>
                </form>

            </div>
        </>
    )
}

export default ProductUpload;
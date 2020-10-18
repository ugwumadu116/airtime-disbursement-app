import React, { useState, useEffect } from 'react'
import TopUp from '../UsingComponent'
import Modal from 'react-animated-modal'
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import request from "../../request";





const Home = () => {
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [balance, setBalance] = useState(0)
    const [error, setError] = useState({
        customer: "",
        amount: ""
    })
    const [airtimeData, setAirtimeData] = useState({
        country: "NG", // change this to your country
        customer: "",
        amount: "",
        recurrence: "ONCE", // you can also change this
        type: "AIRTIME",
        reference: Date.now()

    })

const handleChange = (e) => {
    setError({
        customer: "",
        amount: ""
    })
    setAirtimeData({
        ...airtimeData,
        [e.target.name]: e.target.value
    })
}

const PurchaseAirtime = async() => {
    try {
        const pattern = /^([0]{1})([7-9]{1})([0|1]{1})([\d]{1})([\d]{7,8})$/g; // this validate nigeria number
   
        if(pattern.test(airtimeData.customer.replace(/\s+/g, ''))){
            setLoading(true)
            const reqBody = {
                ...airtimeData,
                customer: "+234" + airtimeData.customer.slice(1)
    
            }
    
            const res = await request({
                url: `/bills`,
                method: "POST",
                data: reqBody,
              });
            setLoading(false)
            toast.success('Airtime Purchase was successful', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
                progress: 0,
            });
    
        }else{
            setError({
                ...error,
                customer: "Nigeria phone numbers only"
            })
        }
        
        
    } catch (err) {
        console.log(err)
        setLoading(false)
        toast.error('Sorry something went wrong', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            progress: 0,
        });

        
    }
    

}


    useEffect(() => {
        const getBalance = async () => {
            const res = await request({
                url: `/balances/NGN`, //Replace NGN with the currency you want to use
                method: "GET",

            });
            if (res.data.data) {

                setBalance(res.data.data.available_balance)
            }
        }
        getBalance()

    }, [])

    const handleAirtime = () => {
        if (balance) {
            setShowModal(true)

        } else {
            toast.error('You do not have money enough money to buy airtime', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
                progress: 0,
            });

        }
    }

    return (
        <div className="container">

            <Modal
                visible={showModal}
                closemodal={() =>
                    setShowModal(false)
                }
                type="zoomIn"
            >
                <h2> Purchase Airtime </h2>
                <div className="modal-content-wrapper">

                    <input type="text" name="customer" value={airtimeData.customer} onChange={handleChange} placeholder="Enter Phone number" />
                    <div>
                        <p className="error-text">{error.customer}</p>
                    </div>
                    <input type="number" name="amount" value={airtimeData.amount} onChange={handleChange} placeholder="Enter amount" />
                    <div>
                        <p className="error-text">{error.amount}</p>
                    </div>
                    {

                        loading ? <ClipLoader /> : <button className="cursor" onClick={PurchaseAirtime}
                        >Buy</button>
                    }
                </div>
            </Modal>
            <div className="App" >

                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    // closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />

                <ToastContainer />

                <div className="d-flex-row">
                    <svg width="173" height="34" viewBox="0 0 173 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M56.9515 7.93262H57.0187C57.3543 7.93262 57.5557 8.19928 57.5557 8.53262V23.9993C57.5557 24.266 57.3543 24.5326 57.0187 24.5326C56.7501 24.5326 56.4816 24.3326 56.4816 23.9993V8.46595C56.4816 8.19928 56.683 7.93262 56.9515 7.93262ZM42.2486 8.73262H52.3862C52.7219 8.73262 52.9233 9.06595 52.9233 9.33262C52.9233 9.59928 52.7219 9.86595 52.3862 9.86595H42.7857V16.3326H51.4463C51.7149 16.3326 51.9834 16.5326 51.9834 16.866C51.9834 17.1326 51.782 17.3993 51.4463 17.3993H42.8529V24.066C42.7857 24.3993 42.5172 24.666 42.1815 24.666C41.8458 24.666 41.5773 24.3993 41.5773 24.066V9.33262H41.6444C41.6444 8.99928 41.913 8.73262 42.2486 8.73262ZM71.6544 13.5326C71.6544 13.1993 71.3858 12.9993 71.1173 12.9993C70.7816 12.9993 70.5802 13.266 70.5802 13.5326V19.9993C70.5802 22.1993 68.7675 23.9326 66.552 23.866C64.2022 23.866 62.8595 22.3326 62.8595 19.9326V13.5326C62.8595 13.1993 62.591 12.9993 62.3224 12.9993C62.0539 12.9993 61.7853 13.266 61.7853 13.5326V20.1326C61.7853 22.866 63.5309 24.866 66.4178 24.866C68.1633 24.9326 69.8417 23.9993 70.6473 22.466V24.1326C70.6473 24.466 70.9159 24.666 71.1844 24.666C71.5201 24.666 71.7215 24.3993 71.7215 24.1326H71.6544V13.5326ZM81.8591 13.5993C81.8591 13.866 81.5906 14.066 81.322 14.066H77.6295V21.466C77.6295 23.1326 78.5695 23.7326 79.9793 23.7326C80.4493 23.7326 80.9192 23.666 81.322 23.5326C81.5906 23.5326 81.792 23.7326 81.792 23.9993C81.792 24.1993 81.6577 24.3993 81.4563 24.466C80.9192 24.666 80.315 24.7326 79.7779 24.7326C78.0324 24.7326 76.5554 23.7326 76.5554 21.5993V14.066H75.2798C75.0112 14.066 74.7427 13.7993 74.7427 13.5326C74.7427 13.266 75.0112 13.066 75.2798 13.066H76.5554V9.86595C76.5554 9.59928 76.7568 9.33262 77.0253 9.33262H77.0924C77.361 9.33262 77.6295 9.59928 77.6295 9.86595V13.066H81.322C81.5906 13.066 81.8591 13.3326 81.8591 13.5993ZM90.4526 14.066C90.7211 14.066 90.9897 13.866 90.9897 13.5993C90.9897 13.3326 90.7211 13.066 90.4526 13.066H86.7601V9.86595C86.7601 9.59928 86.4915 9.33262 86.223 9.33262H86.1559C85.8873 9.33262 85.6859 9.59928 85.6859 9.86595V13.066H84.4103C84.1418 13.066 83.8732 13.266 83.8732 13.5326C83.8732 13.7993 84.1418 14.066 84.4103 14.066H85.6859V21.5993C85.6859 23.7326 87.1629 24.7326 88.9085 24.7326C89.4455 24.7326 90.0498 24.666 90.5869 24.466C90.7883 24.3993 90.9226 24.1993 90.9226 23.9993C90.9226 23.7326 90.7211 23.5326 90.4526 23.5326C90.0498 23.666 89.5798 23.7326 89.1099 23.7326C87.7 23.7326 86.7601 23.1326 86.7601 21.466V14.066H90.4526ZM93.0038 18.7993C93.0038 15.3993 95.3536 12.7326 98.509 12.7326C101.799 12.7326 103.88 15.3993 103.88 18.7993C103.88 19.066 103.611 19.3326 103.343 19.3326H94.2122C94.4136 22.1993 96.4949 23.866 98.7775 23.866C100.187 23.866 101.597 23.266 102.537 22.266C102.604 22.1993 102.739 22.1326 102.873 22.1326C103.141 22.1326 103.41 22.3993 103.41 22.666C103.41 22.7993 103.343 22.9326 103.209 23.066C102.067 24.3326 100.389 24.9993 98.7104 24.9326C95.6221 24.9326 93.0038 22.5326 93.0038 18.866V18.7993ZM94.1451 18.266C94.3465 15.7326 96.1592 13.7993 98.4418 13.7993C101.06 13.7993 102.47 15.9326 102.604 18.266H94.1451ZM108.244 16.3993C108.982 14.466 110.795 13.066 112.876 12.9326C113.212 12.9326 113.48 13.1993 113.48 13.5993C113.48 13.866 113.279 14.1993 112.943 14.1993H112.876C110.392 14.466 108.244 16.266 108.244 19.9993V24.2659C108.177 24.5993 107.975 24.7993 107.64 24.7993C107.371 24.7993 107.102 24.5326 107.102 24.2659V13.5993C107.17 13.266 107.371 13.066 107.707 13.066C107.975 13.066 108.244 13.3326 108.244 13.5993V16.3993ZM131.204 12.3326C130.399 12.3326 129.727 12.866 129.526 13.666L127.579 19.866L125.632 13.666C125.431 12.866 124.692 12.266 123.819 12.266H123.618C122.745 12.266 122.007 12.7993 121.805 13.666L119.858 19.7993L117.979 13.5993C117.777 12.866 117.106 12.266 116.3 12.266H116.233C115.36 12.266 114.689 12.9993 114.689 13.866C114.689 14.1326 114.756 14.3992 114.823 14.6659L114.823 14.666L117.844 23.266C118.046 24.1326 118.784 24.7326 119.724 24.7993H119.858C120.731 24.7993 121.47 24.1993 121.738 23.3326L123.685 17.1993L125.632 23.3326C125.833 24.1993 126.639 24.7993 127.512 24.7993H127.646C128.586 24.7993 129.392 24.1993 129.593 23.266L132.614 14.5993C132.681 14.3993 132.749 14.1326 132.749 13.9326V13.866C132.749 12.9993 132.077 12.3326 131.204 12.3326ZM135.904 12.9326C137.18 12.5326 138.455 12.266 139.798 12.3326C141.678 12.3326 143.02 12.866 144.027 13.7326C144.967 14.7993 145.437 16.1993 145.37 17.5993V23.066C145.37 23.9993 144.632 24.7326 143.692 24.7326C142.819 24.7326 142.081 24.1326 142.013 23.266C141.073 24.2659 139.731 24.866 138.321 24.7993C136.105 24.7993 134.158 23.466 134.158 21.066C134.158 18.3993 136.173 17.1326 139.059 17.1326C140.066 17.1326 141.073 17.266 142.013 17.5993V17.3993C142.013 15.9326 141.141 15.1993 139.395 15.1993C138.589 15.1993 137.784 15.266 136.978 15.5326C136.844 15.5993 136.642 15.5993 136.508 15.5993C135.703 15.666 135.031 15.066 135.031 14.266C135.031 13.666 135.367 13.1326 135.904 12.9326ZM142.081 20.266C142.081 21.5993 140.939 22.3993 139.328 22.3326C138.254 22.3326 137.448 21.7993 137.448 20.866V20.7993C137.448 19.7993 138.388 19.1326 139.865 19.1326C140.604 19.1326 141.409 19.3326 142.081 19.5993V20.266ZM155.709 13.466C155.911 12.7326 156.582 12.266 157.32 12.266C158.26 12.266 158.999 12.9993 158.999 13.866V13.9326C158.999 14.1993 158.932 14.466 158.797 14.7326L155.172 23.3326C154.836 24.1993 154.031 24.7326 153.158 24.7993H152.957C152.017 24.7326 151.278 24.1326 151.01 23.266L147.25 14.666C147.116 14.3993 147.049 14.1326 147.049 13.866C147.116 12.9326 147.854 12.266 148.727 12.266C149.533 12.266 150.204 12.7993 150.405 13.5326L153.024 20.5326L155.709 13.466ZM160.342 19.066C160.476 22.3993 163.363 24.9993 166.72 24.7993C168.264 24.7993 169.741 24.3326 170.949 23.3326C171.285 23.066 171.419 22.7326 171.419 22.3326V22.266C171.419 21.5326 170.815 20.9326 170.076 20.9326C169.808 20.9326 169.472 20.9993 169.271 21.1993C168.532 21.7326 167.66 22.066 166.787 21.9993C165.31 22.066 164.034 21.066 163.833 19.5993H170.748C171.621 19.5326 172.292 18.7993 172.225 17.9326V17.666C172.225 14.666 169.606 12.1326 166.384 12.1993C162.826 12.1993 160.342 15.066 160.342 18.5326V19.066ZM166.384 14.9993C164.974 14.9993 164.034 15.9993 163.766 17.5993H168.935C168.734 16.066 167.794 14.9993 166.384 14.9993Z" fill="black" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M24.2561 0.265933C39.3618 -2.00073 29.6941 10.8659 24.9946 14.4659C28.2171 16.9326 31.5068 20.3993 32.9167 24.3326C35.535 31.5326 29.0899 32.5993 24.2561 30.7993C18.9523 28.9326 14.2527 24.9326 11.1645 20.2659C10.2917 20.2659 9.35178 20.1326 8.479 19.8659C10.2246 24.7993 10.9631 29.8659 10.4931 33.9993C10.4931 25.6659 6.53205 17.3993 0.82545 10.5326C-1.18864 8.1326 0.892587 6.3326 2.70527 8.66593C3.92552 10.3558 5.04633 12.1143 6.06209 13.9326C8.00905 7.1326 17.6767 1.19927 24.2561 0.265933ZM22.1077 12.5326C25.0617 10.7326 34.058 1.06593 25.6659 1.9326C20.8321 2.46593 14.9912 6.9326 12.5743 9.79927C15.9311 9.39927 19.3551 10.8659 22.1077 12.5326ZM12.5072 11.9326C14.7898 11.7326 17.2739 12.9326 19.1537 14.1326C17.341 14.9993 15.3269 15.5326 13.2457 15.6659C10.1574 15.6659 9.55319 12.1993 12.5072 11.9326ZM13.7828 19.9993C16.4682 22.9993 20.1607 25.9326 24.1218 26.9993C26.4044 27.5993 28.9556 27.3326 28.0157 24.0659C27.0758 21.0659 24.6589 18.3993 22.3091 16.3993C21.6377 16.8659 20.8992 17.3326 20.1607 17.6659C18.1467 18.7993 15.9983 19.5993 13.7828 19.9993Z" fill="#F5A623" />
                    </svg>


                    <h3>{"\u20A6"} {balance}</h3>

                </div>

                <div className="App-header">
                    <TopUp amount={2000} />
                    <button className="cursor" onClick={handleAirtime}>Buy Airtime</button>
                </div>
            </div>
        </div>
    );
}

export default Home;
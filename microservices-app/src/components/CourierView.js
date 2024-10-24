import React, { useState, useEffect } from 'react';
import { 
    Typography, Box, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, Button,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';

const CourierView = () => {
    const [orders, setOrders] = useState([]);
    const [restaurantInfo, setRestaurantInfo] = useState(null);
    const [showRestaurantInfoDialog, setShowRestaurantInfoDialog] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:5003/get_orders_for_courier'); 
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                // Handle errors appropriately (e.g., show error message to the user)
            }
        };
        fetchOrders();
    }, []); 

    const handleStartOrder = (orderId) => {
        console.log(`Starting order with ID: ${orderId}`); 
        // Add your logic to update the order status in the backend here
    };

    const handleRestaurantInfoClick = async (basketId) => { 
        try {
            const response = await fetch(`http://localhost:5003/get_restaurant_info_for_order?basketId=${basketId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRestaurantInfo(data);
            setShowRestaurantInfoDialog(true);
        } catch (error) {
            console.error('Error fetching restaurant info:', error);
        }
    };

    const handleCloseDialog = () => {
        setShowRestaurantInfoDialog(false);
    };

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Courier Dashboard
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Restaurant</TableCell> 
                            <TableCell>Contains</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.basket_id}>
                                <TableCell>{order.basket_id}</TableCell>
                                <TableCell>{order.restaurant_name}</TableCell>  
                                <TableCell>{order.items.join(', ')}</TableCell>
                                <TableCell>{order.total_price ? order.total_price.toFixed(2) : '0.00'} zł</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="info" 
                                        onClick={() => handleRestaurantInfoClick(order.basket_id)}
                                    >
                                        Restaurant Info
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="success" 
                                        onClick={() => handleStartOrder(order.basket_id)}
                                    >
                                        Start
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Restaurant Info Dialog */}
            <Dialog open={showRestaurantInfoDialog} onClose={handleCloseDialog}>
                <DialogTitle>Restaurant Information</DialogTitle>
                <DialogContent>
                    {restaurantInfo ? (
                        <>
                            <DialogContentText>Name: {restaurantInfo.name}</DialogContentText>
                            <DialogContentText>Address: {restaurantInfo.address}</DialogContentText>
                            <DialogContentText>City: {restaurantInfo.city}</DialogContentText> 
                        </>
                    ) : (
                        <DialogContentText>Loading...</DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CourierView;

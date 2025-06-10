import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoveLeft, Trash2, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const ordersData = [
	{
		id: 'P1001',
		name: 'Apple iPhone 15',
		phone: '+20 1001234567',
		price: 45000,
		image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
		description:
			'The latest Apple iPhone with advanced features and improved camera.',
		weight: '172g',
		packaging: 'Boxed',
		paymentType: 'In-app payment',
		deliveryType: 'Inside the city',
		sender: {
			name: 'John Doe',
			phone: '+20 1012345678',
			country: 'Egypt',
			city: 'Cairo',
			district: 'Nasr City',
			street: 'Tayaran St.',
			building: '12',
		},
		receiver: {
			name: 'Ahmed Khaled Ali',
			phone: '+20 102563725524',
			country: 'Egypt',
			city: 'Giza',
			district: 'Dokki',
			street: 'El Mesaha St.',
			building: '5',
		},
	},
	{
		id: 'P1002',
		name: 'Samsung Galaxy S24',
		phone: '+20 1002345678',
		price: 38000,
		image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
		description:
			'Samsung flagship phone with high performance and stunning display.',
		weight: '168g',
		packaging: 'Boxed',
		paymentType: 'In-app payment',
		deliveryType: 'Inside the city',
		sender: {
			name: 'Sarah Smith',
			phone: '+20 1012345679',
			country: 'Egypt',
			city: 'Alexandria',
			district: 'Sidi Gaber',
			street: 'Freedom Rd.',
			building: '8',
		},
		receiver: {
			name: 'Mohamed Hassan',
			phone: '+20 102563725525',
			country: 'Egypt',
			city: 'Cairo',
			district: 'Maadi',
			street: 'Street 9',
			building: '22',
		},
	},
	{
		id: 'P1003',
		name: 'Sony WH-1000XM5 Headphones',
		phone: '+20 1003456789',
		price: 12000,
		image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
		description:
			'Premium noise-cancelling headphones with superior sound quality.',
		weight: '250g',
		packaging: 'Boxed',
		paymentType: 'In-app payment',
		deliveryType: 'Inside the city',
		sender: {
			name: 'Ali Mostafa',
			phone: '+20 1011111111',
			country: 'Egypt',
			city: 'Cairo',
			district: 'Heliopolis',
			street: 'Orouba St.',
			building: '15',
		},
		receiver: {
			name: 'Mona Adel',
			phone: '+20 1022222222',
			country: 'Egypt',
			city: 'Giza',
			district: 'Mohandessin',
			street: 'Shehab St.',
			building: '7',
		},
	},
	{
		id: 'P1004',
		name: 'Dell XPS 13 Laptop',
		phone: '+20 1004567890',
		price: 55000,
		image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
		description:
			'Ultra-thin laptop with powerful performance and stunning display.',
		weight: '1.2kg',
		packaging: 'Boxed',
		paymentType: 'In-app payment',
		deliveryType: 'Inside the city',
		sender: {
			name: 'Karim Nabil',
			phone: '+20 1013333333',
			country: 'Egypt',
			city: 'Cairo',
			district: 'Zamalek',
			street: '26th July St.',
			building: '10',
		},
		receiver: {
			name: 'Sara Youssef',
			phone: '+20 1024444444',
			country: 'Egypt',
			city: 'Alexandria',
			district: 'Stanley',
			street: 'Corniche Rd.',
			building: '3',
		},
	},
	{
		id: 'P1005',
		name: 'Canon EOS 90D Camera',
		phone: '+20 1005678901',
		price: 25000,
		image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
		description:
			'High-resolution DSLR camera for professional photography.',
		weight: '701g',
		packaging: 'Boxed',
		paymentType: 'In-app payment',
		deliveryType: 'Inside the city',
		sender: {
			name: 'Hossam Fathy',
			phone: '+20 1015555555',
			country: 'Egypt',
			city: 'Cairo',
			district: 'Garden City',
			street: 'Kasr El Nile St.',
			building: '2',
		},
		receiver: {
			name: 'Laila Samir',
			phone: '+20 1026666666',
			country: 'Egypt',
			city: 'Giza',
			district: 'Faisal',
			street: 'Faisal St.',
			building: '18',
		},
	},
	{
		id: 'P1006',
		name: 'Apple Watch Series 9',
		phone: '+20 1006789012',
		price: 15000,
		image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b',
		description:
			'Latest Apple smartwatch with health and fitness tracking.',
		weight: '38g',
		packaging: 'Boxed',
		paymentType: 'In-app payment',
		deliveryType: 'Inside the city',
		sender: {
			name: 'Maged Adel',
			phone: '+20 1017777777',
			country: 'Egypt',
			city: 'Cairo',
			district: 'Maadi',
			street: 'Street 9',
			building: '21',
		},
		receiver: {
			name: 'Nourhan Khaled',
			phone: '+20 1028888888',
			country: 'Egypt',
			city: 'Alexandria',
			district: 'Gleem',
			street: 'Gleem Bay',
			building: '6',
		},
	},
	{
		id: 'P1007',
		name: 'Nintendo Switch OLED',
		phone: '+20 1007890123',
		price: 11000,
		image: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c',
		description:
			'Handheld gaming console with vibrant OLED display.',
		weight: '420g',
		packaging: 'Boxed',
		paymentType: 'In-app payment',
		deliveryType: 'Inside the city',
		sender: {
			name: 'Omar Tarek',
			phone: '+20 1019999999',
			country: 'Egypt',
			city: 'Cairo',
			district: 'New Cairo',
			street: '90th St.',
			building: '50',
		},
		receiver: {
			name: 'Salma Ahmed',
			phone: '+20 1020000000',
			country: 'Egypt',
			city: 'Giza',
			district: '6th October',
			street: 'El Mehwar Rd.',
			building: '12',
		},
	},
	{
		id: 'P1008',
		name: 'HP LaserJet Pro Printer',
		phone: '+20 1008901234',
		price: 8000,
		image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231',
		description:
			'Efficient laser printer for home and office use.',
		weight: '7.6kg',
		packaging: 'Boxed',
		paymentType: 'In-app payment',
		deliveryType: 'Inside the city',
		sender: {
			name: 'Yara Mostafa',
			phone: '+20 1011212121',
			country: 'Egypt',
			city: 'Cairo',
			district: 'Nasr City',
			street: 'Makram Ebeid St.',
			building: '8',
		},
		receiver: {
			name: 'Mohamed Fathy',
			phone: '+20 1022323232',
			country: 'Egypt',
			city: 'Alexandria',
			district: 'Sidi Gaber',
			street: 'Freedom Rd.',
			building: '4',
		},
	},
	{
		id: 'P1009',
		name: 'Bose SoundLink Speaker',
		phone: '+20 1009012345',
		price: 6000,
		image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
		description:
			'Portable Bluetooth speaker with deep, loud sound.',
		weight: '670g',
		packaging: 'Boxed',
		paymentType: 'In-app payment',
		deliveryType: 'Inside the city',
		sender: {
			name: 'Heba Khalil',
			phone: '+20 1013434343',
			country: 'Egypt',
			city: 'Cairo',
			district: 'Shoubra',
			street: 'Shoubra St.',
			building: '22',
		},
		receiver: {
			name: 'Mahmoud Gamal',
			phone: '+20 1024545454',
			country: 'Egypt',
			city: 'Giza',
			district: 'Imbaba',
			street: 'El Bahr St.',
			building: '9',
		},
	},
	{
		id: 'P1010',
		name: 'Fitbit Charge 6',
		phone: '+20 1000123456',
		price: 4000,
		image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
		description:
			'Fitness tracker with heart rate and sleep monitoring.',
		weight: '29g',
		packaging: 'Boxed',
		paymentType: 'In-app payment',
		deliveryType: 'Inside the city',
		sender: {
			name: 'Rania Said',
			phone: '+20 1015656565',
			country: 'Egypt',
			city: 'Cairo',
			district: 'Helwan',
			street: 'Helwan St.',
			building: '11',
		},
		receiver: {
			name: 'Omar Khaled',
			phone: '+20 1026767676',
			country: 'Egypt',
			city: 'Alexandria',
			district: 'Miami',
			street: 'Miami St.',
			building: '2',
		},
	},
];

const Orders = () => {
	const [search, setSearch] = useState('');
	const [orders, setOrders] = useState(ordersData);
	const [selectedOrder, setSelectedOrder] = useState<any>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [showSuccessDelete, setShowSuccessDelete] = useState(false);

	const filteredOrders = orders.filter(
		(c) =>
			c.name.toLowerCase().includes(search.toLowerCase()) ||
			c.phone.includes(search) ||
			c.id.includes(search)
	);

	const handleBack = () => {
		window.history.back();
	};

	const handleDelete = (id: string) => {
		setOrders((orders) => orders.filter((order) => order.id !== id));
		setDialogOpen(false);
	};

	const handleOpenDialog = (order: any) => {
		setSelectedOrder(order);
		setDialogOpen(true);
	};

	const handleDeleteClick = (id: string) => {
		setDeleteId(id);
		setConfirmDeleteOpen(true);
	};

	const handleConfirmDelete = () => {
		if (deleteId) {
			handleDelete(deleteId);
			setDeleteId(null);
			setConfirmDeleteOpen(false);
			setShowSuccessDelete(true);
			setTimeout(() => setShowSuccessDelete(false), 2000);
		}
	};

	const InfoInput = ({
		label,
		value,
	}: {
		label: string;
		value: string | number;
	}) => (
		<div className="flex items-center bg-gray-50 border rounded-xl px-4 py-2 mb-2">
			<span className="mr-2 text-gray-500 min-w-[110px]">{label}</span>
			<Input
				value={value}
				readOnly
				className="bg-transparent border-0 flex-1 text-left"
			/>
		</div>
	);

	return (
		<div className="p-6">
			<div className="flex justify-between items-center pb-10">
				<Input
					type="text"
					placeholder="Search for Product ..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-80"
				/>
				<Button
					variant="secondary"
					onClick={handleBack}
					className="flex items-center gap-2 bg-[#2d2926] text-white px-8 py-3 rounded-full text-base font-medium shadow hover:bg-[#1a1817] transition"
				>
					<MoveLeft />
					Back
				</Button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{filteredOrders.map((order) => (
					<div
						key={order.id}
						className="bg-white rounded-3xl shadow-md overflow-hidden relative flex flex-col cursor-pointer"
						onClick={() => handleOpenDialog(order)}
					>
						<img
							src={order.image}
							alt={order.name}
							className="w-full h-44 object-cover"
						/>
						<div className="p-4 text-center flex-1 flex flex-col justify-between">
							<div className="font-medium">{order.name}</div>
							<div className="text-gray-500 text-sm">{order.phone}</div>
							<div className="my-2 font-bold">
								ID: <span className="font-extrabold">{order.id}</span>
							</div>
							<div className="text-green-600 text-2xl font-bold">
								{order.price} EGP
							</div>
						</div>
					</div>
				))}
			</div>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="max-w-7xl w-full">
					{selectedOrder && (
						<div className="max-h-[90vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
								<div className="col-span-1 flex flex-col items-center">
									<img
										src={selectedOrder.image}
										alt={selectedOrder.name}
										className="rounded-2xl w-64 h-64 object-cover mb-4"
									/>
									<div className="w-full bg-white rounded-2xl p-4 shadow mt-2">
										<div className="font-semibold mb-2 text-green-700">
											Receiver Info
										</div>
										<div className="flex flex-col gap-2">
											<div className="flex items-center bg-gray-50 border rounded-xl px-4 py-2">
												<span className="mr-2 text-gray-500 min-w-[110px]">
													Name:
												</span>
												<Input
													value={selectedOrder.receiver.name}
													readOnly
													className="bg-transparent border-0 flex-1 text-left"
												/>
											</div>
											<div className="flex items-center bg-gray-50 border rounded-xl px-4 py-2">
												<span className="mr-2 text-gray-500 min-w-[110px]">
													Phone:
												</span>
												<Input
													value={selectedOrder.receiver.phone}
													readOnly
													className="bg-transparent border-0 flex-1 text-left"
												/>
											</div>
											<Button
												variant="destructive"
												className="mt-4 w-full"
												onClick={() => handleDeleteClick(selectedOrder.id)}
											>
												<Trash2 className="mr-2" size={18} /> Delete Order
											</Button>
										</div>
									</div>
								</div>
								<div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-2">
										<div className="font-semibold text-green-700 mb-2">
											Order Info
										</div>
										<InfoInput
											label="Delivery Type:"
											value={selectedOrder.deliveryType}
										/>
										<InfoInput label="ID:" value={selectedOrder.id} />
										<InfoInput
											label="Product Name:"
											value={selectedOrder.name}
										/>
										<InfoInput
											label="Description:"
											value={selectedOrder.description}
										/>
										<InfoInput label="Weight:" value={selectedOrder.weight} />
										<InfoInput
											label="Packaging:"
											value={selectedOrder.packaging}
										/>
										<InfoInput
											label="Payment Type:"
											value={selectedOrder.paymentType}
										/>
										<InfoInput
											label="Price:"
											value={selectedOrder.price + ' EGP'}
										/>
									</div>
									<div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-2">
										<div className="font-semibold text-green-700 mb-2">
											Sender Info
										</div>
										<InfoInput label="Name:" value={selectedOrder.sender.name} />
										<InfoInput label="Phone:" value={selectedOrder.sender.phone} />
										<InfoInput
											label="Country:"
											value={selectedOrder.sender.country}
										/>
										<InfoInput label="City:" value={selectedOrder.sender.city} />
										<InfoInput
											label="District:"
											value={selectedOrder.sender.district}
										/>
										<InfoInput label="Street:" value={selectedOrder.sender.street} />
										<InfoInput
											label="Building:"
											value={selectedOrder.sender.building}
										/>
									</div>
									<div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-2">
										<div className="font-semibold text-green-700 mb-2">
											Receiver Address
										</div>
										<InfoInput
											label="Country:"
											value={selectedOrder.receiver.country}
										/>
										<InfoInput label="City:" value={selectedOrder.receiver.city} />
										<InfoInput
											label="District:"
											value={selectedOrder.receiver.district}
										/>
										<InfoInput label="Street:" value={selectedOrder.receiver.street} />
										<InfoInput
											label="Building:"
											value={selectedOrder.receiver.building}
										/>
									</div>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			<Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
				<DialogContent className="max-w-md w-full flex flex-col items-center justify-center text-center">
					<div className="text-lg font-medium mb-8 mt-8">
						Are you sure you want to delete this order?
					</div>
					<Button
            className="bg-gradient-to-r from-[#303030] to-[#a15b26] text-white mt-6 px-10 text-lg py-5 rounded-full"
						onClick={handleConfirmDelete}
						variant="default"
					>
						Confirm
					</Button>
				</DialogContent>
			</Dialog>

			<Dialog open={showSuccessDelete} onOpenChange={setShowSuccessDelete}>
				<DialogContent className="max-w-md w-full flex flex-col items-center justify-center text-center">
					<div className="text-lg font-medium mb-8 mt-8">
						Request successfully deleted
					</div>
					<CheckCircle2 size={48} className="text-green-500 mx-auto mb-8" />
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Orders;
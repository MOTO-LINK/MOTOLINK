import { Button } from '@/components/ui/button';
import { MoveLeft, Trash2, Check } from 'lucide-react';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Dialog as ConfirmDialog, DialogContent as ConfirmDialogContent, DialogHeader as ConfirmDialogHeader, DialogTitle as ConfirmDialogTitle, DialogTrigger as ConfirmDialogTrigger, DialogClose as ConfirmDialogClose } from '@/components/ui/dialog';

const complaints = [
  {
    date: '22 / 2 / 2025',
    name: 'Ali Adel Mohammed',
    phone: '+20 01183925678',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    status: 'active',
    id: 'DFw4567quhg',
    message:
      'I have an issue with the delivery of my order with id: 1456RTSGsGS\nThe order arrived broken and I want a solution.',
  },
  {
    date: '22 / 2 / 2025',
    name: 'Ali Adel Mohammed',
    phone: '+20 01183925678',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    status: 'active',
    id: 'DFw4567quhg',
    message:
      'I have an issue with the delivery of my order with id: 1456RTSGsGS\nThe order arrived broken and I want a solution.',
  },
  {
    date: '22 / 2 / 2025',
    name: 'Ali Adel Mohammed',
    phone: '+20 01183925678',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    status: 'active',
    id: 'DFw4567quhg',
    message:
      'I have an issue with the delivery of my order with id: 1456RTSGsGS\nThe order arrived broken and I want a solution.',
  },
  {
    date: '22 / 2 / 2025',
    name: 'Ali Adel Mohammed',
    phone: '+20 01183925678',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    status: 'active',
    id: 'DFw4567quhg',
    message:
      'I have an issue with the delivery of my order with id: 1456RTSGsGS\nThe order arrived broken and I want a solution.',
  },
  {
    date: '22 / 2 / 2025',
    name: 'Ali Adel Mohammed',
    phone: '+20 01183925678',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    status: 'active',
    id: 'DFw4567quhg',
    message:
      'I have an issue with the delivery of my order with id: 1456RTSGsGS\nThe order arrived broken and I want a solution.',
  },
  {
    date: '22 / 2 / 2025',
    name: 'Ali Adel Mohammed',
    phone: '+20 01183925678',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    status: 'active',
    id: 'DFw4567quhg',
    message:
      'I have an issue with the delivery of my order with id: 1456RTSGsGS\nThe order arrived broken and I want a solution.',
  },
  {
    date: '22 / 2 / 2025',
    name: 'Ali Adel Mohammed',
    phone: '+20 01183925678',
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
    status: 'active',
    id: 'DFw4567quhg',
    message:
      'I have an issue with the delivery of my order with id: 1456RTSGsGS\nThe order arrived broken and I want a solution.',
  },
  {
    date: '22 / 2 / 2025',
    name: 'Ali Adel Mohammed',
    phone: '+20 01183925678',
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
    status: 'active',
    id: 'DFw4567quhg',
    message:
      'I have an issue with the delivery of my order with id: 1456RTSGsGS\nThe order arrived broken and I want a solution.',
  },
];

const ComplaintsSecondPage = () => {
  const [openDialogIdx, setOpenDialogIdx] = useState<number | null>(null);
  const [reply, setReply] = useState('');
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [complaintsList, setComplaintsList] = useState(complaints);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showReplySuccess, setShowReplySuccess] = useState(false);

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between" dir="ltr">
      <div className="flex-1">
        {complaintsList.map((item, idx) => (
          <Dialog key={item.id} open={openDialogIdx === idx} onOpenChange={open => setOpenDialogIdx(open ? idx : null)}>
            <DialogTrigger asChild>
              <div
                className="flex flex-row items-center border-b border-dashed border-gray-200 px-8 py-4 cursor-pointer hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4 w-2/4">
                  <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <span className="text-gray-500 text-sm">{item.phone}</span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-4 w-2/4">
                  <span className="text-gray-500 text-sm">{item.date}</span>
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-lg rounded-2xl p-0">
              <DialogHeader>
                <div className="flex flex-col items-center pt-8 pb-2">
                  <DialogTitle className="text-center w-full mb-2">Comments</DialogTitle>
                  <div className="relative">
                    <img src={item.avatar} alt={item.name} className="w-20 h-20 rounded-full object-cover mx-auto" />
                  </div>
                  <span className="mt-3 font-medium text-gray-800">{item.name}</span>
                  <span className="text-gray-500 text-sm">{item.phone}</span>
                </div>
              </DialogHeader>
              <div className="px-8 pb-8 flex flex-col gap-4">
                <div>
                  <label className="block text-gray-500 text-sm mb-1">Order ID:</label>
                  <input
                    type="text"
                    value={item.id}
                    readOnly
                    className="w-full py-2 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-700"
                  />
                </div>
                <div>
                  <textarea
                    value={item.message}
                    readOnly
                    rows={3}
                    className="w-full py-3 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 resize-none"
                  />
                </div>
                <div>
                  <textarea
                    value={openDialogIdx === idx ? reply : ''}
                    onChange={e => setReply(e.target.value)}
                    rows={3}
                    placeholder="Type your reply"
                    className="w-full py-3 px-4 rounded-lg border border-gray-200 bg-white text-gray-700 resize-none"
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-[#2d2417] to-[#a86f2d] text-white rounded-full py-3 text-lg mt-2"
                  onClick={() => {
                    if (reply.trim()) {
                      setShowReplySuccess(true);
                      setReply('');
                      setOpenDialogIdx(null);
                    }
                  }}
                >
                  Send Reply
                </Button>
                <ConfirmDialog open={deleteIdx === idx} onOpenChange={open => setDeleteIdx(open ? idx : null)}>
                  <ConfirmDialogTrigger asChild>
                    <button
                      className="absolute top-6 left-6 bg-[#23201b] hover:bg-[#3a3327] text-white rounded-full w-8 h-8 flex items-center justify-center shadow z-10"
                      onClick={e => {
                        e.stopPropagation();
                        setDeleteIdx(idx);
                      }}
                      title="Delete"
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </ConfirmDialogTrigger>
                  <ConfirmDialogContent className="max-w-md rounded-2xl p-0 flex flex-col items-center justify-center">
                    <ConfirmDialogHeader>
                      <ConfirmDialogTitle className="text-center w-full mt-8 mb-8 text-lg font-medium">
                        Are you sure you want to delete this complaint?
                      </ConfirmDialogTitle>
                    </ConfirmDialogHeader>
                    <div className="flex flex-col items-center justify-center w-full pb-8">
                      <ConfirmDialogClose asChild>
                        <Button
                          className="w-40 h-12 rounded-full bg-gradient-to-r from-[#23201b] to-[#a86f2d] text-white text-lg mt-2"
                          onClick={() => {
                            setComplaintsList(prev =>
                              prev.filter((_, i) => i !== idx)
                            );
                            setDeleteIdx(null);
                            setOpenDialogIdx(null);
                            setShowSuccess(true);
                          }}
                        >
                          Confirm
                        </Button>
                      </ConfirmDialogClose>
                    </div>
                  </ConfirmDialogContent>
                </ConfirmDialog>
              </div>
            </DialogContent>
          </Dialog>
        ))}
        <ConfirmDialog open={showSuccess} onOpenChange={setShowSuccess}>
          <ConfirmDialogContent className="max-w-md rounded-2xl flex flex-col items-center justify-center py-16">
            <ConfirmDialogHeader>
              <ConfirmDialogTitle className="text-center w-full mb-6 text-lg font-medium">
                Complaint deleted successfully
              </ConfirmDialogTitle>
            </ConfirmDialogHeader>
            <div className="flex flex-col items-center justify-center w-full">
              <span className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-2">
                <Check className="w-8 h-8 text-white" />
              </span>
            </div>
          </ConfirmDialogContent>
        </ConfirmDialog>
        <ConfirmDialog open={showReplySuccess} onOpenChange={setShowReplySuccess}>
          <ConfirmDialogContent className="max-w-md rounded-2xl flex flex-col items-center justify-center py-16">
            <ConfirmDialogHeader>
              <ConfirmDialogTitle className="text-center w-full mb-6 text-lg font-medium">
                Reply sent to the customer successfully
              </ConfirmDialogTitle>
            </ConfirmDialogHeader>
            <div className="flex flex-col items-center justify-center w-full">
              <span className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-2">
                <Check className="w-8 h-8 text-white" />
              </span>
            </div>
          </ConfirmDialogContent>
        </ConfirmDialog>
      </div>
      <div className="fixed bottom-0 left-100 w-full  flex justify-start items-center px-8 py-6 shadow z-20">
        <Button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 bg-[#2d2926] text-white px-8 py-3 rounded-full text-base font-medium shadow hover:bg-[#1a1817] transition"
        >
          <span>Back</span>
          <MoveLeft />
        </Button>
      </div>
    </div>
  );
};

export default ComplaintsSecondPage;
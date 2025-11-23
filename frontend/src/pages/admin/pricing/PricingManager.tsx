/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import type { RoomType } from '../../../types/RoomType';
import {
    getAllRoomTypes,
    getRoomTypeById,
    saveRoomType,
} from '../../../services/roomTypeService';
import holidayService from '../../../services/HolidayService';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../../../components/my-card/components/ui/card';
import { Button } from '../../../components/my-button/components/ui/button';
import { Input } from '../../../components/my-input/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../components/Table';
import { Edit2, X, Check } from 'lucide-react';
import { data } from 'react-router-dom';

type SeasonRule = {
    id?: string;
    name: string;
    start: string;
    end: string;
    mode: 'multiplier' | 'fixed';
    value: number;
};

type SpecialPrice = {
    id?: string;
    date: string;
    price: number;
    note?: string;
};

export default function PricingManager() {
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [editing, setEditing] = useState<any | null>(null);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [yearForHolidays, setYearForHolidays] = useState<string>(
        String(new Date().getFullYear()),
    );
    const [msg, setMsg] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<
        'base' | 'season' | 'byHour' | 'extra'
    >('base');

    const [rowEditing, setRowEditing] = useState<string | null>(null);
    const [priceEdits, setPriceEdits] = useState<Record<string, number>>({});

    useEffect(() => {
        loadRoomTypes();
    }, []);

    useEffect(() => {
        if (selectedId) loadRoomType(selectedId);
        else setEditing(null);
    }, [selectedId]);

    async function loadRoomTypes() {
        setLoading(true);
        try {
            const data = await getAllRoomTypes();
            setRoomTypes(data || []);
            if (data?.length && !selectedId) {
                setSelectedId(String(data[0].id ?? data[0].typeId));
            }
            console.log('Rerender PricingManager', data);
        } catch (e) {
            console.error(e);
            setMsg('Failed to load room types');
        } finally {
            setLoading(false);
        }
    }

    async function loadRoomType(id: string) {
        setLoading(true);
        try {
            const rt = await getRoomTypeById(id);
            const normalized = {
                ...rt,
                pricingRules: rt.pricingRules ?? [],
                specialPrices: rt.specialPrices ?? [],
                basePrice: rt.basePrice ?? rt.roomPrice ?? 0,
            };
            setEditing(normalized);
        } catch (e) {
            console.error(e);
            setMsg('Failed to load room type');
            setEditing(null);
        } finally {
            setLoading(false);
        }
    }

    function startRowEdit(roomTypeID: string, currentPrice: number) {
        if (!roomTypeID) return;
        setSelectedId(String(roomTypeID));
        setRowEditing(roomTypeID);
        setPriceEdits((p) => ({ ...p, [roomTypeID]: currentPrice }));
    }

    function cancelRowEdit(roomTypeID?: string) {
        // clear edit state and selected room type
        const key = roomTypeID ?? selectedId;
        setRowEditing(null);
        setSelectedId(null);
        setPriceEdits((p) => {
            const c = { ...p };
            if (key) delete c[String(key)];
            return c;
        });
    }
    async function saveRowPrice() {
        const targetId = rowEditing;
        console.log('Saving price for row:', targetId);
        if (!targetId) return;

        const newPrice = priceEdits[targetId];
        if (newPrice == null) return;

        setSaving(true);
        try {
            const currentRoomType = await getRoomTypeById(targetId);

            const payload: RoomType = {
                ...currentRoomType,
                basePrice: Number(newPrice),
            };

            await saveRoomType(payload);
            await loadRoomTypes();
            setMsg('Saved price');
            cancelRowEdit(targetId);
        } catch (err: any) {
            console.error('Error saving room type:', err);
            alert('Save failed');
        } finally {
            setSaving(false);
        }
    }

    const fmt = (v: number | undefined) =>
        typeof v === 'number'
            ? v.toLocaleString('vi-VN', { maximumFractionDigits: 0 })
            : '-';

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-2xl font-semibold mb-4">Pricing Management</h1>

            {/* TABS */}
            <div className="mb-6">
                <div className="bg-gray-100/80 p-2 rounded-full shadow-sm">
                    <div className="max-w-4xl mx-auto grid grid-cols-4 gap-3">
                        {[
                            { key: 'base', label: 'Base Prices' },
                            { key: 'season', label: 'Seasonal' },
                            { key: 'byHour', label: 'By Hour' },
                            { key: 'extra', label: 'Extra Fees' },
                        ].map((t) => {
                            const active = activeTab === (t.key as any);
                            return (
                                <button
                                    key={t.key}
                                    onClick={() => setActiveTab(t.key as any)}
                                    className={`w-full text-sm py-2 rounded-full ${
                                        active
                                            ? 'bg-white shadow-md font-semibold'
                                            : 'text-gray-600 hover:bg-white/50'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* BASE PRICE TAB */}
            {activeTab === 'base' && (
                <Card>
                    <CardHeader className="mt-6">
                        <CardTitle>Base Prices</CardTitle>
                        <CardDescription>
                            Manage base nightly prices
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Room Type</TableHead>
                                    <TableHead className="text-right">
                                        Capacity
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Area
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {roomTypes.map((rt) => {
                                    const idStr = String(rt.roomTypeID);

                                    const base = (rt as any).basePrice ?? 0;

                                    const isEditing = rowEditing === idStr;

                                    return (
                                        <TableRow key={idStr}>
                                            <TableCell>{rt.typeName}</TableCell>

                                            <TableCell className="text-right">
                                                {rt.maxOccupancy}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                {rt.area ?? rt.area
                                                    ? `${rt.area ?? rt.area} m²`
                                                    : '—'}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                {isEditing ? (
                                                    <div className="flex justify-end items-center gap-2">
                                                        <Input
                                                            type="number"
                                                            className="w-28 h-8"
                                                            value={
                                                                priceEdits[
                                                                    idStr
                                                                ] ?? base
                                                            }
                                                            onChange={(e) =>
                                                                setPriceEdits(
                                                                    (p) => ({
                                                                        ...p,
                                                                        [idStr]:
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            ),
                                                                    }),
                                                                )
                                                            }
                                                        />
                                                        <span className="text-xs">
                                                            VND
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span>{fmt(base)} VND</span>
                                                )}
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    {isEditing ? (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    saveRowPrice()
                                                                }
                                                                className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center"
                                                            >
                                                                <Check className="h-4 w-4 text-green-600" />
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    cancelRowEdit()
                                                                }
                                                                className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center"
                                                            >
                                                                <X className="h-4 w-4 text-red-600" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                startRowEdit(
                                                                    idStr,
                                                                    base,
                                                                )
                                                            }
                                                            className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

<template>
    <div class="dashboard-container">
        <h1>Overview</h1>
        <div class="grid">
            <div class="col-4">
                <div class="text-center p-3 font-bold">
                    <Card>
                        <template #title>
                            <h2>Total Affected Areas</h2>
                        </template>

                        <template #content>
                            <p>{{ totalAffectedAreas }}</p>
                        </template>
                    </Card>
                </div>
            </div>
            <div class="col-4">
                <div class="text-center p-3 font-bold">
                    <Card>
                        <template #title>
                            <h2>Total Tasks</h2>
                        </template>

                        <template #content>
                            <p>{{ totalTasks }}</p>
                        </template>
                    </Card>
                </div>
            </div>
            <div class="col-4">
                <div class="text-center p-3 font-bold">
                    <Card>
                        <template #title>
                            <h2>Total Requests</h2>
                        </template>

                        <template #content>
                            <p>{{ totalTaskRequests }}</p>
                        </template>
                    </Card>
                </div>
            </div>
            <div class="col-4">
                <div class="text-center p-3 font-bold">
                    <Card>
                        <template #title>
                            <h2>Total Feedbacks</h2>
                        </template>

                        <template #content>
                            <p>{{ totalFeedbacks }}</p>
                        </template>
                    </Card>
                </div>
            </div>
            <div class="col-4">
                <div class="text-center p-3 font-bold">
                    <Card>
                        <template #title>
                            <h2>Total Officers</h2>
                        </template>

                        <template #content>
                            <p>{{ totalOfficers }}</p>
                        </template>
                    </Card>
                </div>
            </div>
            <div class="col-4">
                <div class="text-center p-3 font-bold">
                    <Card>
                        <template #title>
                            <h2>Total Volunteers</h2>
                        </template>

                        <template #content>
                            <p>{{ totalVolunteers }}</p>
                        </template>
                    </Card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
    getTotalAffectedAreas,
    getTotalTasks,
    getTotalTaskRequests,
    getTotalVolunteers,
    getTotalOfficers,
    getTotalFeedbacks
} from '@/model/DashboardModel';

// Reactive references for storing data
const totalAffectedAreas = ref(0);
const totalTasks = ref(0);
const totalTaskRequests = ref(0);
const totalVolunteers = ref(0);
const totalOfficers = ref(0);
const totalFeedbacks = ref(0);

// Fetch dashboard data on component mount
onMounted(async () => {
    try {
        totalAffectedAreas.value = await getTotalAffectedAreas();
        totalTasks.value = await getTotalTasks();
        totalTaskRequests.value = await getTotalTaskRequests();
        totalVolunteers.value = await getTotalVolunteers();
        totalOfficers.value = await getTotalOfficers();
        totalFeedbacks.value = await getTotalFeedbacks();
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
});
</script>

<style scoped></style>
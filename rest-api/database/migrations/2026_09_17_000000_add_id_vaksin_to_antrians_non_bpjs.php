<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('antrians_non_bpjs', function (Blueprint $table) {
            if (!Schema::hasColumn('antrians_non_bpjs', 'id_vaksin')) {
                $table->integer('id_vaksin')->nullable()->default(null)->after('jadwal_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('antrians_non_bpjs', function (Blueprint $table) {
            if (Schema::hasColumn('antrians_non_bpjs', 'id_vaksin')) {
                $table->dropColumn('id_vaksin');
            }
        });
    }
};

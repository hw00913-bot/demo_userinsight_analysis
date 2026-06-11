// ============================================
// 渠道效果 - 异步下载明细数据
// ============================================
function downloadChannelEffectDetail() {
    var btn = document.getElementById('channelEffectDownloadBtn');
    if (!btn) return;

    // 设置加载状态
    btn.classList.add('loading');
    var iconEl = btn.querySelector('i');
    var spanEl = btn.querySelector('span');
    var originalIcon = iconEl.className;
    var originalText = spanEl.textContent;
    iconEl.className = 'fa-solid fa-spinner fa-spin';
    spanEl.textContent = '下载中...';

    // 恢复按钮状态的通用函数
    function restoreBtn() {
        btn.classList.remove('loading');
        iconEl.className = originalIcon;
        spanEl.textContent = originalText;
    }

    // 模拟异步接口请求（实际对接后端API时替换为 fetch 调用）
    simulateAsyncDownload(buildChannelEffectWorkbookData())
        .then(function(workbook) {
            var now = new Date();
            var timestamp = formatTimestamp(now);
            downloadExcelWorkbook(workbook, '渠道效果明细_' + timestamp + '.xlsx');
        })
        .catch(function(err) {
            console.error('下载失败:', err);
            alert('下载失败，请稍后重试');
        })
        .finally(restoreBtn);
}

// 生成时间戳字符串 YYYYMMDD_HHmmss
function formatTimestamp(date) {
    var d = formatDate(date).replace(/-/g, '');
    return d + '_'
        + String(date.getHours()).padStart(2, '0')
        + String(date.getMinutes()).padStart(2, '0')
        + String(date.getSeconds()).padStart(2, '0');
}

// 通过 Blob 触发浏览器文件下载
function downloadFile(content, filename, mimeType) {
    var BOM = '﻿'; // BOM 确保 Excel 正确识别中文
    var blob = new Blob([BOM + content], { type: mimeType });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function downloadExcelWorkbook(workbook, filename) {
    var content = generateXlsxBinary(workbook);
    var blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    downloadBlob(blob, filename);
}

function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function xlsxXmlEscape(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function generateXlsxBinary(workbook) {
    var files = buildXlsxFiles(workbook);
    return zipFiles(files);
}

function buildXlsxFiles(workbook) {
    var workbookRels = workbook.sheets.map(function(sheet, index) {
        return '<Relationship Id="rId' + (index + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (index + 1) + '.xml"/>';
    }).join('') + '<Relationship Id="rId' + (workbook.sheets.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>';

    var workbookSheets = workbook.sheets.map(function(sheet, index) {
        return '<sheet name="' + xlsxXmlEscape(sheet.name) + '" sheetId="' + (index + 1) + '" r:id="rId' + (index + 1) + '"/>';
    }).join('');

    var contentTypes = workbook.sheets.map(function(sheet, index) {
        return '<Override PartName="/xl/worksheets/sheet' + (index + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
    }).join('');

    var files = [
        {
            name: '[Content_Types].xml',
            content: '<?xml version="1.0" encoding="UTF-8"?>'
                + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
                + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
                + '<Default Extension="xml" ContentType="application/xml"/>'
                + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
                + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
                + '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
                + '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
                + contentTypes
                + '</Types>'
        },
        {
            name: '_rels/.rels',
            content: '<?xml version="1.0" encoding="UTF-8"?>'
                + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
                + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
                + '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
                + '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>'
                + '</Relationships>'
        },
        {
            name: 'docProps/core.xml',
            content: '<?xml version="1.0" encoding="UTF-8"?>'
                + '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
                + '<dc:creator>用户洞察</dc:creator><cp:lastModifiedBy>用户洞察</cp:lastModifiedBy>'
                + '<dcterms:created xsi:type="dcterms:W3CDTF">2026-06-03T00:00:00Z</dcterms:created>'
                + '<dcterms:modified xsi:type="dcterms:W3CDTF">2026-06-03T00:00:00Z</dcterms:modified>'
                + '</cp:coreProperties>'
        },
        {
            name: 'docProps/app.xml',
            content: '<?xml version="1.0" encoding="UTF-8"?>'
                + '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
                + '<Application>Microsoft Excel</Application>'
                + '</Properties>'
        },
        {
            name: 'xl/workbook.xml',
            content: '<?xml version="1.0" encoding="UTF-8"?>'
                + '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
                + '<sheets>' + workbookSheets + '</sheets>'
                + '</workbook>'
        },
        {
            name: 'xl/_rels/workbook.xml.rels',
            content: '<?xml version="1.0" encoding="UTF-8"?>'
                + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
                + workbookRels
                + '</Relationships>'
        },
        {
            name: 'xl/styles.xml',
            content: '<?xml version="1.0" encoding="UTF-8"?>'
                + '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
                + '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>'
                + '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD9EAF7"/><bgColor indexed="64"/></patternFill></fill></fills>'
                + '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
                + '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
                + '<cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="1" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs>'
                + '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
                + '</styleSheet>'
        }
    ];

    workbook.sheets.forEach(function(sheet, index) {
        files.push({
            name: 'xl/worksheets/sheet' + (index + 1) + '.xml',
            content: buildWorksheetXml(sheet)
        });
    });

    return files;
}

function buildWorksheetXml(sheet) {
    var rows = [sheet.headers].concat(sheet.rows);
    var xmlRows = rows.map(function(row, rowIndex) {
        var cells = row.map(function(cell, cellIndex) {
            var ref = columnName(cellIndex + 1) + (rowIndex + 1);
            var style = rowIndex === 0 ? ' s="1"' : '';
            if (typeof cell === 'number') {
                return '<c r="' + ref + '"' + style + '><v>' + cell + '</v></c>';
            }
            return '<c r="' + ref + '" t="inlineStr"' + style + '><is><t>' + xlsxXmlEscape(cell) + '</t></is></c>';
        }).join('');
        return '<row r="' + (rowIndex + 1) + '">' + cells + '</row>';
    }).join('');

    return '<?xml version="1.0" encoding="UTF-8"?>'
        + '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
        + '<sheetData>' + xmlRows + '</sheetData>'
        + '</worksheet>';
}

function columnName(index) {
    var name = '';
    while (index > 0) {
        index--;
        name = String.fromCharCode(65 + (index % 26)) + name;
        index = Math.floor(index / 26);
    }
    return name;
}

function stringToUtf8Bytes(value) {
    var str = String(value);
    // 优先使用标准 TextEncoder API
    if (typeof TextEncoder !== 'undefined') {
        return new TextEncoder().encode(str);
    }
    // 手动 UTF-8 编码（兼容旧浏览器）
    var bytes = [];
    for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        if (code < 0x80) {
            bytes.push(code);
        } else if (code < 0x800) {
            bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
        } else if (code < 0xd800 || code >= 0xe000) {
            bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
        } else {
            // 代理对 (surrogate pair)
            i++;
            var next = str.charCodeAt(i);
            var cp = 0x10000 + ((code - 0xd800) << 10) | (next - 0xdc00);
            bytes.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3f), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
        }
    }
    return new Uint8Array(bytes);
}

function numberToBytes(value, length) {
    var bytes = new Uint8Array(length);
    for (var i = 0; i < length; i++) {
        bytes[i] = value & 0xff;
        value >>>= 8;
    }
    return bytes;
}

function concatBytes(parts) {
    var length = parts.reduce(function(sum, part) { return sum + part.length; }, 0);
    var bytes = new Uint8Array(length);
    var offset = 0;
    parts.forEach(function(part) {
        bytes.set(part, offset);
        offset += part.length;
    });
    return bytes;
}

function buildCrc32Table() {
    var table = [];
    for (var n = 0; n < 256; n++) {
        var c = n;
        for (var k = 0; k < 8; k++) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        table[n] = c >>> 0;
    }
    return table;
}

var XLSX_CRC32_TABLE = buildCrc32Table();

function crc32(bytes) {
    var crc = 0xffffffff;
    for (var i = 0; i < bytes.length; i++) {
        crc = XLSX_CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
}

function zipFiles(files) {
    var localParts = [];
    var centralParts = [];
    var offset = 0;
    var generalPurposeFlag = 0x0800;
    var dosTime = (10 << 11) | (30 << 5);
    var dosDate = ((2026 - 1980) << 9) | (6 << 5) | 3;

    files.forEach(function(file) {
        var nameBytes = stringToUtf8Bytes(file.name);
        var contentBytes = stringToUtf8Bytes(file.content);
        var crc = crc32(contentBytes);
        var localHeader = concatBytes([
            numberToBytes(0x04034b50, 4),
            numberToBytes(20, 2),
            numberToBytes(generalPurposeFlag, 2),
            numberToBytes(0, 2),
            numberToBytes(dosTime, 2),
            numberToBytes(dosDate, 2),
            numberToBytes(crc, 4),
            numberToBytes(contentBytes.length, 4),
            numberToBytes(contentBytes.length, 4),
            numberToBytes(nameBytes.length, 2),
            numberToBytes(0, 2),
            nameBytes,
            contentBytes
        ]);
        localParts.push(localHeader);

        centralParts.push(concatBytes([
            numberToBytes(0x02014b50, 4),
            numberToBytes(20, 2),
            numberToBytes(20, 2),
            numberToBytes(generalPurposeFlag, 2),
            numberToBytes(0, 2),
            numberToBytes(dosTime, 2),
            numberToBytes(dosDate, 2),
            numberToBytes(crc, 4),
            numberToBytes(contentBytes.length, 4),
            numberToBytes(contentBytes.length, 4),
            numberToBytes(nameBytes.length, 2),
            numberToBytes(0, 2),
            numberToBytes(0, 2),
            numberToBytes(0, 2),
            numberToBytes(0, 2),
            numberToBytes(0, 4),
            numberToBytes(offset, 4),
            nameBytes
        ]));
        offset += localHeader.length;
    });

    var centralDir = concatBytes(centralParts);
    var endRecord = concatBytes([
        numberToBytes(0x06054b50, 4),
        numberToBytes(0, 2),
        numberToBytes(0, 2),
        numberToBytes(files.length, 2),
        numberToBytes(files.length, 2),
        numberToBytes(centralDir.length, 4),
        numberToBytes(offset, 4),
        numberToBytes(0, 2)
    ]);

    return concatBytes(localParts.concat([centralDir, endRecord]));
}

function buildChannelEffectWorkbookData() {
    return {
        sheets: [
            buildLeadDimensionSheet(channelEffectDetailData),
            buildOverlapUserDimensionSheet()
        ]
    };
}

function buildLeadDimensionSheet(data) {
    var headers = [
        '线索id', '创建时间', '意向车系', '渠道名称', '媒体名称', '大项目', '落地平台',
        '大区', '小区', '专营店编码', '专营店名称', '省份', '城市', '线索等级',
        '原因类型大类', '原因类型', '原因说明', '线索量', '有效线索量', '线索排程量', '新增到店量', '试驾量',
        '锁单量', '交车量'
    ];
    var storeSamples = [
        ['华东一区', '上海区', 'SH001', '上海东风南方', '上海', '上海'],
        ['华北区', '北京区', 'BJ001', '北京朝阳', '北京', '北京'],
        ['华南区', '广州区', 'GZ001', '广州天河', '广东', '广州'],
        ['华南区', '深圳区', 'SZ001', '深圳南山', '广东', '深圳'],
        ['西南区', '成都区', 'CD001', '成都锦江', '四川', '成都']
    ];
    var rows = data.rows.map(function(row, index) {
        var store = storeSamples[index % storeSamples.length];
        var leadDate = row[3];
        var leadLevel = row[4];
        var callStatus = row[5];
        var hasSchedule = leadLevel.indexOf('H-试驾排程单') === 0 ? 1 : 0;
        var hasArrival = row[7] && row[7] !== '-' ? 1 : 0;
        var hasTestDrive = row[8] && row[8] !== '-' ? 1 : 0;
        var hasLock = row[9] && row[9] !== '-' ? 1 : 0;
        var hasDelivery = row[10] && row[10] !== '-' ? 1 : 0;
        return [
            'CL' + leadDate.replace(/-/g, '') + String(index + 1).padStart(4, '0'),
            leadDate + ' ' + String(9 + (index % 9)).padStart(2, '0') + ':00:00',
            row[2],
            row[0],
            row[1],
            'NEV渠道质量提升项目',
            row[1] + '落地页',
            store[0],
            store[1],
            store[2],
            store[3],
            store[4],
            store[5],
            leadLevel,
            callStatus === '已接通' ? '有效建联' : '无法建联',
            callStatus,
            callStatus === '已接通' ? '用户已接通并完成线索培育' : '号码状态或通话状态导致未有效建联',
            1,
            callStatus === '已接通' ? 1 : 0,
            hasSchedule,
            hasArrival,
            hasTestDrive,
            hasLock,
            hasDelivery
        ];
    });
    return { name: '渠道媒体效果明细--线索维度', headers: headers, rows: rows };
}

function buildOverlapUserDimensionSheet() {
    var headers = [
        '手机号(脱敏）',
        '用户姓名(脱敏）',
        '留资次数',
        '首次留资时间',
        '首次留资渠道',
        '最后留资渠道',
        '留资渠道数量',
        '重合渠道名称列表',
        '首次留资媒体',
        '最后留资媒体',
        '留资媒体数量',
        '重合媒体名称列表'
    ];
    var rows = [];
    var names = ['张*', '李*', '王*', '赵*', '孙*', '周*', '吴*', '郑*', '陈*', '刘*', '黄*', '杨*'];

    function splitOverlapNames(value) {
        return String(value || '').split(/\s*\+\s*/).filter(Boolean);
    }

    function maskedPhone(index) {
        var prefixes = ['138', '139', '136', '137', '135', '133', '132', '131', '130', '188', '186', '185'];
        var suffix = String(1200 + index * 37).slice(-4);
        return prefixes[index % prefixes.length] + '****' + suffix;
    }

    function appendRows(source, sourceType) {
        Object.keys(source).forEach(function(groupKey) {
            var group = source[groupKey];
            group.rows.forEach(function(item, index) {
                var namesList = splitOverlapNames(item.media);
                var sampleCount = Math.min(item.overlapCount, 3);
                for (var i = 0; i < sampleCount; i++) {
                    var rowIndex = rows.length;
                    var firstName = namesList[0] || '';
                    var lastName = namesList[(i + namesList.length - 1) % namesList.length] || firstName;
                    var firstTime = '2026-05-' + String(10 + (rowIndex % 20)).padStart(2, '0')
                        + ' ' + String(9 + (rowIndex % 9)).padStart(2, '0')
                        + ':' + String((rowIndex * 7) % 60).padStart(2, '0') + ':00';
                    var channelNames = sourceType === '渠道' ? namesList : ['R' + ((rowIndex % 11) + 1), 'R' + (((rowIndex + 3) % 11) + 1)];
                    var mediaNames = sourceType === '媒体' ? namesList : ['抖音', '懂车帝', '百度', '快手', '小红书', '朋友圈'][rowIndex % 6].split(',');
                    var channelCount = Math.max(channelNames.length, sourceType === '渠道' ? namesList.length : 2);
                    var mediaCount = Math.max(mediaNames.length, sourceType === '媒体' ? namesList.length : 1);

                    rows.push([
                        maskedPhone(rowIndex),
                        names[rowIndex % names.length],
                        Math.max(channelCount, mediaCount),
                        firstTime,
                        sourceType === '渠道' ? firstName : channelNames[0],
                        sourceType === '渠道' ? lastName : channelNames[channelNames.length - 1],
                        channelCount,
                        channelNames.join(' + '),
                        sourceType === '媒体' ? firstName : mediaNames[0],
                        sourceType === '媒体' ? lastName : mediaNames[mediaNames.length - 1],
                        mediaCount,
                        mediaNames.join(' + ')
                    ]);
                }
            });
        });
    }

    appendRows(channelOverlapFullData, '渠道');
    appendRows(mediaOverlapFullData, '媒体');
    return { name: '渠道媒体重复度分析--用户维度', headers: headers, rows: rows };
}

// 生成 CSV 内容
function generateCsv(data) {
    var parts = [];
    parts.push(data.headers.join(','));
    data.rows.forEach(function(row) {
        parts.push(row.map(function(cell) {
            return '"' + String(cell).replace(/"/g, '""') + '"';
        }).join(','));
    });
    return parts.join('\n');
}

// 模拟异步下载（实际对接后端时替换为 fetch 调用）
function simulateAsyncDownload(data) {
    return new Promise(function(resolve) {
        var delay = 800 + Math.random() * 1200;
        setTimeout(function() {
            resolve(data);
        }, delay);
    });
}
